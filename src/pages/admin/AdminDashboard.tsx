import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { adminService } from '../../services/adminService';
import { 
  Building2, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  ShieldX, 
  Ban,
  CheckCircle2,
  Search,
  ToggleLeft,
  ToggleRight,
  LogOut
} from 'lucide-react';

interface Empresa {
  id: string;
  razonSocial: string;
  ruc: string;
  isVerified: boolean;
  isActive: boolean;
  logoUrl?: string;
  sector?: { nombre: string };
  ciudad?: { nombre: string };
  user?: { email: string; createdAt: string };
  _count?: { jobOffers: number };
  submittedAt?: string;
}

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'todas' | 'verificadas' | 'deshabilitadas'>('todas');
  const [stats, setStats] = useState<any>(null);
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  /* const [selectedCompany, setSelectedCompany] = useState<Empresa | null>(null); */

  useEffect(() => {
    loadDashboard();
    loadCompanies();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await adminService.getDashboard();
      setStats(data.stats);
    } catch {
      setError('Error al cargar dashboard');
    }
  };

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllCompanies();
      setCompanies(data.empresas);
    } catch {
      setError('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (empresaId: string) => {
    try {
      const result = await adminService.verifyCompany(empresaId);
      setSuccessMessage(result.message);
      loadCompanies();
      loadDashboard();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError('Error al verificar empresa');
    }
  };

  const handleToggleStatus = async (empresaId: string) => {
    try {
      const result = await adminService.toggleCompanyStatus(empresaId);
      setSuccessMessage(result.message);
      loadCompanies();
      loadDashboard();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setError('Error al cambiar estado');
    }
  };

  const filteredCompanies = companies.filter((emp) => {
    const matchesSearch = 
      emp.razonSocial?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.ruc?.includes(searchQuery) ||
      emp.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'verificadas') return matchesSearch && emp.isVerified;
    if (activeTab === 'deshabilitadas') return matchesSearch && !emp.isActive;
    return matchesSearch;
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-cream shadow-sm border-b border-cream-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-brown font-sans">Suma Admin</h1>
              <p className="text-xs text-brown/50">Panel de administración</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-brown/60">{user?.email}</span>
            <span className="px-3 py-1 bg-teal-50 text-teal text-xs font-bold rounded-full uppercase">
              Superadmin
            </span>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-cream-100 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="text-red-400">×</button>
          </div>
        )}
        {successMessage && (
          <div className="bg-teal-50 border border-teal-200 text-teal px-4 py-3 rounded-xl mb-6 text-sm">
            {successMessage}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={<Users className="w-5 h-5" />} 
              label="Postulantes" 
              value={stats.totalPostulantes} 
              color="text-teal" 
              bg="bg-teal-50" 
            />
            <StatCard 
              icon={<Building2 className="w-5 h-5" />} 
              label="Empresas" 
              value={stats.totalEmpresas} 
              color="text-coral" 
              bg="bg-coral-50" 
            />
            <StatCard 
              icon={<ShieldCheck className="w-5 h-5" />} 
              label="Verificadas" 
              value={stats.empresasVerificadas} 
              color="text-teal" 
              bg="bg-teal-50" 
            />
            <StatCard 
              icon={<Briefcase className="w-5 h-5" />} 
              label="Ofertas" 
              value={stats.totalOfertas} 
              color="text-brown" 
              bg="bg-cream-100" 
            />
          </div>
        )}

        {/* Tabs + Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 mb-6">
          <div className="p-4 border-b border-cream-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-1 bg-cream-50 p-1 rounded-xl">
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'verificadas', label: 'Verificadas' },
                { key: 'deshabilitadas', label: 'Deshabilitadas' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-teal shadow-sm'
                      : 'text-brown/50 hover:text-brown'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/30" />
              <input
                type="text"
                placeholder="Buscar empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm text-brown focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream-50/50 border-b border-cream-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-brown/50 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brown/50 uppercase tracking-wider">RUC</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brown/50 uppercase tracking-wider">Sector</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brown/50 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brown/50 uppercase tracking-wider">Verificación</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-brown/50 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brown/30">
                      <div className="animate-spin w-6 h-6 border-2 border-teal border-t-transparent rounded-full mx-auto" />
                    </td>
                  </tr>
                ) : filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brown/30">
                      No se encontraron empresas
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((emp) => (
                    <tr key={emp.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center overflow-hidden">
                            {emp.logoUrl ? (
                              <img src={emp.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-5 h-5 text-brown/30" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-brown text-sm">{emp.razonSocial || 'Sin nombre'}</p>
                            <p className="text-xs text-brown/40">{emp.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-brown/70">{emp.ruc || '—'}</td>
                      <td className="px-6 py-4 text-sm text-brown/70">{emp.sector?.nombre || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          emp.isActive 
                            ? 'bg-teal-50 text-teal' 
                            : 'bg-red-50 text-red-500'
                        }`}>
                          {emp.isActive ? (
                            <><CheckCircle2 className="w-3 h-3" /> Activa</>
                          ) : (
                            <><Ban className="w-3 h-3" /> Deshabilitada</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleVerify(emp.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            emp.isVerified
                              ? 'bg-teal text-white hover:bg-teal-600'
                              : 'bg-cream-100 text-brown/50 hover:bg-cream-200'
                          }`}
                        >
                          {emp.isVerified ? (
                            <><ShieldCheck className="w-3 h-3" /> Verificada</>
                          ) : (
                            <><ShieldX className="w-3 h-3" /> No verificada</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* <button
                            onClick={() => setSelectedCompany(emp)}
                            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4 text-brown/40" />
                          </button> */}
                          <button
                            onClick={() => handleToggleStatus(emp.id)}
                            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
                            title={emp.isActive ? 'Deshabilitar' : 'Habilitar'}
                          >
                            {emp.isActive ? (
                              <ToggleRight className="w-5 h-5 text-teal" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-brown/30" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de detalle (opcional) */}
      {/* {selectedCompany && (
        <CompanyDetailModal 
          company={selectedCompany} 
          onClose={() => setSelectedCompany(null)}
          onVerify={() => handleVerify(selectedCompany.id)}
          onToggleStatus={() => handleToggleStatus(selectedCompany.id)}
        />
      )} */}
    </div>
  );
};

// Componentes auxiliares
const StatCard = ({ icon, label, value, color, bg }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
      <div className={color}>{icon}</div>
    </div>
    <p className="text-2xl font-bold text-brown font-sans">{value}</p>
    <p className="text-sm text-brown/50">{label}</p>
  </div>
);

/* const CompanyDetailModal = ({ company, onClose, onVerify, onToggleStatus }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold text-brown mb-4">{company.razonSocial}</h2> */
        {/* Detalles de la empresa... */}
        {/* <div className="flex gap-3 mt-6">
          <button onClick={onVerify} className="flex-1 bg-teal text-white py-2.5 rounded-xl font-bold text-sm">
            {company.isVerified ? 'Quitar verificación' : 'Verificar empresa'}
          </button>
          <button onClick={onToggleStatus} className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${
            company.isActive ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal'
          }`}>
            {company.isActive ? 'Deshabilitar' : 'Habilitar'}
          </button>
        </div>
      </div>
    </div>
  </div>
); */}

export default AdminDashboard;