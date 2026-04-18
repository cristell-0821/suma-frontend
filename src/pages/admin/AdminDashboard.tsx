import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { adminService } from '../../services/adminService';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pendientes'>('dashboard');
  
  const [stats, setStats] = useState<any>(null);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await adminService.getDashboard();
      setStats(data.stats);
    } catch (err) {
      setError('Error al cargar dashboard');
    }
  };

  const loadPendingCompanies = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingCompanies();
      setPendingCompanies(data.empresas);
    } catch (err) {
      setError('Error al cargar empresas pendientes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (empresaId: string) => {
    try {
      await adminService.approveCompany(empresaId);
      setSuccessMessage('Empresa aprobada exitosamente');
      loadPendingCompanies();
      loadDashboard();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al aprobar empresa');
    }
  };

  const handleVerify = async (empresaId: string) => {
    try {
      await adminService.verifyCompany(empresaId);
      setSuccessMessage('Empresa verificada como inclusiva');
      loadPendingCompanies();
      loadDashboard();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error al verificar empresa');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-brown-500">Suma Admin</h1>
            <p className="text-sm text-brown-400">Panel de administración</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-brown-500">{user?.email}</span>
            <span className="chip bg-purple-100 text-purple-700 text-xs">SUPERADMIN</span>
            <button onClick={handleLogout} className="btn-outline text-sm py-2 px-4">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => { setActiveTab('dashboard'); loadDashboard(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-coral-500 text-coral-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('pendientes'); loadPendingCompanies(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'pendientes'
                  ? 'border-coral-500 text-coral-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Empresas pendientes
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
            {successMessage}
          </div>
        )}

        {/* Tab: Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Estadísticas de la plataforma</h2>
            
            {stats ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card text-center">
                  <p className="text-3xl font-bold text-coral-500">{stats.totalPostulantes}</p>
                  <p className="text-brown-400">Postulantes</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-teal-500">{stats.totalEmpresas}</p>
                  <p className="text-brown-400">Empresas</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-yellow-500">{stats.empresasPendientes}</p>
                  <p className="text-brown-400">Pendientes de aprobación</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-blue-500">{stats.totalOfertas}</p>
                  <p className="text-brown-400">Ofertas publicadas</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-brown-400">Cargando estadísticas...</p>
            )}
          </div>
        )}

        {/* Tab: Empresas pendientes */}
        {activeTab === 'pendientes' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Empresas pendientes de aprobación</h2>
            
            {loading ? (
              <p className="text-center text-brown-400">Cargando...</p>
            ) : pendingCompanies.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-brown-400">No hay empresas pendientes de aprobación</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingCompanies.map((empresa) => (
                  <div key={empresa.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-brown-500">
                          {empresa.razonSocial || 'Sin nombre registrado'}
                        </h3>
                        <p className="text-brown-400">RUC: {empresa.ruc || 'No registrado'}</p>
                        <p className="text-sm text-brown-400 mt-1">
                          Email: {empresa.user?.email}
                        </p>
                        <p className="text-sm text-brown-400">
                          Registrada: {new Date(empresa.submittedAt).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                      <span className="chip bg-yellow-100 text-yellow-700">
                        Pendiente
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-brown-400">Sector:</p>
                        <p className="text-brown-500">{empresa.sector || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-brown-400">Tamaño:</p>
                        <p className="text-brown-500">{empresa.tamaño || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-brown-400">Contacto:</p>
                        <p className="text-brown-500">{empresa.nombreContacto || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-brown-400">Teléfono:</p>
                        <p className="text-brown-500">{empresa.telefonoContacto || 'No especificado'}</p>
                      </div>
                    </div>

                    {empresa.accommodations?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-brown-400 mb-2">Acomodaciones:</p>
                        <div className="flex flex-wrap gap-1">
                          {empresa.accommodations.map((acc: string, idx: number) => (
                            <span key={idx} className="chip bg-cream-200 text-brown-500 text-xs">
                              {acc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(empresa.id)}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        Aprobar empresa
                      </button>
                      <button
                        onClick={() => handleVerify(empresa.id)}
                        className="btn-secondary text-sm py-2 px-4"
                      >
                        Aprobar y verificar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;