import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { postulanteService } from '../../services/postulanteService';
import { disabilitiesService } from '../../services/disabilitiesService';

const PostulanteDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ofertas' | 'postulaciones' | 'perfil'>('ofertas');
  
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [disabilities, setDisabilities] = useState<any[]>([]);
  
  const [filters, setFilters] = useState({
    modality: '',
    sector: '',
    city: '',
    disabilityId: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [profileData, disabilitiesData] = await Promise.all([
        postulanteService.getProfile(),
        disabilitiesService.getAll(),
      ]);
      setPerfil(profileData);
      setDisabilities(disabilitiesData);
      loadOfertas();
    } catch (err) {
      setError('Error al cargar datos iniciales');
    }
  };

  const loadOfertas = async () => {
    setLoading(true);
    try {
      const data = await postulanteService.getJobOffers(filters);
      setOfertas(data);
    } catch (err) {
      setError('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const loadPostulaciones = async () => {
    setLoading(true);
    try {
      const data = await postulanteService.getMyApplications();
      setPostulaciones(data);
    } catch (err) {
      setError('Error al cargar postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobOfferId: string) => {
    try {
      await postulanteService.applyToJob(jobOfferId, 'Me interesa esta oferta');
      setSuccessMessage('¡Postulación enviada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al postular');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENVIADO': return 'bg-gray-100 text-gray-700';
      case 'EN_REVISION': return 'bg-yellow-100 text-yellow-700';
      case 'ENTREVISTA': return 'bg-blue-100 text-blue-700';
      case 'CONTRATADO': return 'bg-green-100 text-green-700';
      case 'RECHAZADO': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ENVIADO': return 'Enviado';
      case 'EN_REVISION': return 'En revisión';
      case 'ENTREVISTA': return 'Entrevista';
      case 'CONTRATADO': return 'Contratado';
      case 'RECHAZADO': return 'No seleccionado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-brown-500">Suma</h1>
            <p className="text-sm text-brown-400">Súmate al trabajo inclusivo</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-brown-500">{user?.email}</span>
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
              onClick={() => { setActiveTab('ofertas'); loadOfertas(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'ofertas'
                  ? 'border-coral-500 text-coral-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Buscar ofertas
            </button>
            <button
              onClick={() => { setActiveTab('postulaciones'); loadPostulaciones(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'postulaciones'
                  ? 'border-coral-500 text-coral-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Mis postulaciones
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'perfil'
                  ? 'border-coral-500 text-coral-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Mi perfil
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

        {/* Tab: Ofertas */}
        {activeTab === 'ofertas' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Ofertas de trabajo</h2>
            
            {/* Filtros */}
            <div className="card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.modality}
                  onChange={(e) => setFilters({ ...filters, modality: e.target.value })}
                  className="input-field"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="PRESENCIAL">Presencial</option>
                </select>

                <input
                  type="text"
                  placeholder="Sector"
                  value={filters.sector}
                  onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                  className="input-field"
                />

                <input
                  type="text"
                  placeholder="Ciudad"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="input-field"
                />

                <button onClick={loadOfertas} className="btn-primary">
                  Filtrar
                </button>
              </div>
            </div>

            {/* Lista de ofertas */}
            {loading ? (
              <p className="text-center text-brown-400">Cargando...</p>
            ) : ofertas.length === 0 ? (
              <p className="text-center text-brown-400">No hay ofertas disponibles</p>
            ) : (
              <div className="grid gap-4">
                {ofertas.map((oferta) => (
                  <div key={oferta.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-brown-500">{oferta.titulo}</h3>
                        <p className="text-brown-400">{oferta.empresa.razonSocial}</p>
                        {oferta.empresa.isVerified && (
                          <span className="chip-teal text-xs">Empresa verificada</span>
                        )}
                      </div>
                      <span className="chip bg-cream-200 text-brown-500">
                        {oferta.modalidad}
                      </span>
                    </div>

                    <p className="text-brown-400 mb-4 line-clamp-2">{oferta.descripcion}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {oferta.disabilities.map((d: any) => (
                        <span key={d.id} className="chip-coral text-xs">
                          {d.nombre}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-brown-400">
                        <span>{oferta.ciudad}</span>
                        {oferta.salarioMin && (
                          <span className="ml-4">
                            S/ {oferta.salarioMin.toLocaleString()} - {oferta.salarioMax?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleApply(oferta.id)}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        Postular
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Postulaciones */}
        {activeTab === 'postulaciones' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Mis postulaciones</h2>
            
            {loading ? (
              <p className="text-center text-brown-400">Cargando...</p>
            ) : postulaciones.length === 0 ? (
              <p className="text-center text-brown-400">Aún no has postulado a ninguna oferta</p>
            ) : (
              <div className="grid gap-4">
                {postulaciones.map((post) => (
                  <div key={post.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-brown-500">{post.jobOffer.titulo}</h3>
                        <p className="text-brown-400">{post.jobOffer.empresa.razonSocial}</p>
                      </div>
                      <span className={`chip ${getStatusColor(post.status)}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    </div>
                    <p className="text-sm text-brown-400">
                      Postulado el: {new Date(post.createdAt).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Perfil */}
        {activeTab === 'perfil' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Mi perfil</h2>
            
            {perfil ? (
              <div className="card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Nombres</label>
                    <p className="text-brown-500 font-medium">{perfil.nombres || 'No completado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Apellidos</label>
                    <p className="text-brown-500 font-medium">{perfil.apellidos || 'No completado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Email</label>
                    <p className="text-brown-500 font-medium">{perfil.user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Teléfono</label>
                    <p className="text-brown-500 font-medium">{perfil.telefono || 'No completado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Ciudad</label>
                    <p className="text-brown-500 font-medium">{perfil.ciudad || 'No completado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Modalidad preferida</label>
                    <p className="text-brown-500 font-medium">{perfil.modalidadPreferida || 'No completado'}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-brown-400 mb-2">Discapacidades</label>
                  <div className="flex flex-wrap gap-2">
                    {perfil.disabilities?.length > 0 ? (
                      perfil.disabilities.map((d: any) => (
                        <span key={d.id} className="chip-coral">
                          {d.nombre}
                        </span>
                      ))
                    ) : (
                      <p className="text-brown-400">No especificado</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-brown-400 mb-2">Habilidades</label>
                  <div className="flex flex-wrap gap-2">
                    {perfil.skills?.length > 0 ? (
                      perfil.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="chip bg-cream-200 text-brown-500">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-brown-400">No especificado</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-brown-400">Cargando perfil...</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PostulanteDashboard;