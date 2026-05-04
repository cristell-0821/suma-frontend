import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { empresaService } from '../../services/empresaService';
import { disabilitiesService } from '../../services/disabilitiesService';

const EmpresaDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'ofertas' | 'postulantes' | 'perfil' | 'nueva'>('ofertas');
  
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [postulantes, setPostulantes] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>(null);
  const [disabilities, setDisabilities] = useState<any[]>([]);
  
  const [newOffer, setNewOffer] = useState({
    titulo: '',
    descripcion: '',
    requisitos: [''],
    funciones: [''],
    modalidad: 'HIBRIDO',
    sector: '',
    ciudad: '',
    salarioMin: '',
    salarioMax: '',
    disabilityIds: [] as string[],
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
        empresaService.getProfile(),
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
      const data = await empresaService.getMyJobOffers();
      setOfertas(data);
    } catch (err) {
      setError('Error al cargar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const loadPostulantes = async () => {
    setLoading(true);
    try {
      const data = await empresaService.getApplicants();
      setPostulantes(data);
    } catch (err) {
      setError('Error al cargar postulantes');
    } finally {
      setLoading(false);
    }
  };

/*   const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const data = {
        ...newOffer,
        salarioMin: newOffer.salarioMin ? parseInt(newOffer.salarioMin) : undefined,
        salarioMax: newOffer.salarioMax ? parseInt(newOffer.salarioMax) : undefined,
        requisitos: newOffer.requisitos.filter(r => r.trim() !== ''),
        funciones: newOffer.funciones.filter(f => f.trim() !== ''),
      };

      await empresaService.createJobOffer(data);
      setSuccessMessage('¡Oferta creada exitosamente!');
      setNewOffer({
        titulo: '',
        descripcion: '',
        requisitos: [''],
        funciones: [''],
        modalidad: 'HIBRIDO',
        sector: '',
        ciudad: '',
        salarioMin: '',
        salarioMax: '',
        disabilityIds: [],
      });
      setActiveTab('ofertas');
      loadOfertas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear oferta');
    }
  }; */

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      await empresaService.updateApplicationStatus(applicationId, newStatus);
      setSuccessMessage('Estado actualizado');
      loadPostulantes();
    } catch (err) {
      setError('Error al actualizar estado');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const addRequisito = () => {
    setNewOffer({ ...newOffer, requisitos: [...newOffer.requisitos, ''] });
  };

  const updateRequisito = (index: number, value: string) => {
    const updated = [...newOffer.requisitos];
    updated[index] = value;
    setNewOffer({ ...newOffer, requisitos: updated });
  };

  const addFuncion = () => {
    setNewOffer({ ...newOffer, funciones: [...newOffer.funciones, ''] });
  };

  const updateFuncion = (index: number, value: string) => {
    const updated = [...newOffer.funciones];
    updated[index] = value;
    setNewOffer({ ...newOffer, funciones: updated });
  };

  const toggleDisability = (id: string) => {
    const current = newOffer.disabilityIds;
    if (current.includes(id)) {
      setNewOffer({ ...newOffer, disabilityIds: current.filter(d => d !== id) });
    } else {
      setNewOffer({ ...newOffer, disabilityIds: [...current, id] });
    }
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
            <p className="text-sm text-brown-400">Portal de empresas inclusivas</p>
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
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Mis ofertas
            </button>
            <button
              onClick={() => { setActiveTab('nueva'); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'nueva'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Nueva oferta
            </button>
            <button
              onClick={() => { setActiveTab('postulantes'); loadPostulantes(); }}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'postulantes'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Postulantes
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'perfil'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-brown-400 hover:text-brown-500'
              }`}
            >
              Mi empresa
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

        {/* Tab: Mis Ofertas */}
        {activeTab === 'ofertas' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Mis ofertas de trabajo</h2>
            
            {loading ? (
              <p className="text-center text-brown-400">Cargando...</p>
            ) : ofertas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-brown-400 mb-4">Aún no has creado ninguna oferta</p>
                <button onClick={() => setActiveTab('nueva')} className="btn-secondary">
                  Crear primera oferta
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {ofertas.map((oferta) => (
                  <div key={oferta.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-brown-500">{oferta.titulo}</h3>
                        <p className="text-sm text-brown-400">
                          {oferta._count?.applications || 0} postulantes
                        </p>
                      </div>
                      <span className={`chip ${oferta.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {oferta.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    <p className="text-brown-400 text-sm mb-2">{oferta.modalidad} • {oferta.ciudad}</p>
                    <div className="flex flex-wrap gap-1">
                      {oferta.disabilities.map((d: any) => (
                        <span key={d.id} className="chip-teal text-xs">
                          {d.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Nueva Oferta */}
        {activeTab === 'nueva' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Crear nueva oferta</h2>
            
            {/* <form onSubmit={handleCreateOffer} className="card space-y-6">
              <div>
                <label className="block text-sm font-medium text-brown-500 mb-1">Título del puesto *</label>
                <input
                  type="text"
                  value={newOffer.titulo}
                  onChange={(e) => setNewOffer({ ...newOffer, titulo: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-500 mb-1">Descripción *</label>
                <textarea
                  value={newOffer.descripcion}
                  onChange={(e) => setNewOffer({ ...newOffer, descripcion: e.target.value })}
                  className="input-field min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-500 mb-1">Modalidad *</label>
                  <select
                    value={newOffer.modalidad}
                    onChange={(e) => setNewOffer({ ...newOffer, modalidad: e.target.value })}
                    className="input-field"
                  >
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="PRESENCIAL">Presencial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-500 mb-1">Sector *</label>
                  <input
                    type="text"
                    value={newOffer.sector}
                    onChange={(e) => setNewOffer({ ...newOffer, sector: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brown-500 mb-1">Ciudad *</label>
                  <input
                    type="text"
                    value={newOffer.ciudad}
                    onChange={(e) => setNewOffer({ ...newOffer, ciudad: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown-500 mb-1">Salario mínimo (S/)</label>
                  <input
                    type="number"
                    value={newOffer.salarioMin}
                    onChange={(e) => setNewOffer({ ...newOffer, salarioMin: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-500 mb-1">Salario máximo (S/)</label>
                  <input
                    type="number"
                    value={newOffer.salarioMax}
                    onChange={(e) => setNewOffer({ ...newOffer, salarioMax: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-500 mb-2">Requisitos</label>
                {newOffer.requisitos.map((req, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={req}
                    onChange={(e) => updateRequisito(idx, e.target.value)}
                    className="input-field mb-2"
                    placeholder={`Requisito ${idx + 1}`}
                  />
                ))}
                <button type="button" onClick={addRequisito} className="text-teal-600 text-sm hover:underline">
                  + Agregar requisito
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-500 mb-2">Funciones</label>
                {newOffer.funciones.map((func, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={func}
                    onChange={(e) => updateFuncion(idx, e.target.value)}
                    className="input-field mb-2"
                    placeholder={`Función ${idx + 1}`}
                  />
                ))}
                <button type="button" onClick={addFuncion} className="text-teal-600 text-sm hover:underline">
                  + Agregar función
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-500 mb-2">Discapacidades compatibles *</label>
                <div className="grid grid-cols-2 gap-2">
                  {disabilities.map((d) => (
                    <label key={d.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-cream-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newOffer.disabilityIds.includes(d.id)}
                        onChange={() => toggleDisability(d.id)}
                        className="w-4 h-4 text-teal-600"
                      />
                      <span className="text-sm text-brown-500">{d.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-secondary w-full">
                Publicar oferta
              </button>
            </form> */}
          </div>
        )}

        {/* Tab: Postulantes */}
        {activeTab === 'postulantes' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Postulantes</h2>
            
            {loading ? (
              <p className="text-center text-brown-400">Cargando...</p>
            ) : postulantes.length === 0 ? (
              <p className="text-center text-brown-400">Aún no hay postulantes en tus ofertas</p>
            ) : (
              <div className="grid gap-4">
                {postulantes.map((post) => (
                  <div key={post.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-brown-500">
                          {post.postulante.nombres} {post.postulante.apellidos}
                        </h3>
                        <p className="text-brown-400">{post.postulante.user?.email}</p>
                        <p className="text-sm text-brown-400 mt-1">
                          Postuló a: {post.jobOffer.titulo}
                        </p>
                      </div>
                      <span className={`chip ${getStatusColor(post.status)}`}>
                        {getStatusLabel(post.status)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-brown-400 mb-2">Habilidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {post.postulante.skills?.map((skill: string, idx: number) => (
                          <span key={idx} className="chip bg-cream-200 text-brown-500 text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-brown-400 mb-2">Discapacidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {post.postulante.disabilities?.map((d: any) => (
                          <span key={d.id} className="chip-teal text-xs">
                            {d.nombre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {post.mensaje && (
                      <p className="text-sm text-brown-500 italic mb-4">"{post.mensaje}"</p>
                    )}

                    <div className="flex gap-2">
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value)}
                        className="input-field text-sm py-2"
                      >
                        <option value="ENVIADO">Enviado</option>
                        <option value="EN_REVISION">En revisión</option>
                        <option value="ENTREVISTA">Entrevista</option>
                        <option value="CONTRATADO">Contratado</option>
                        <option value="RECHAZADO">No seleccionado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Perfil */}
        {activeTab === 'perfil' && (
          <div>
            <h2 className="text-xl font-bold text-brown-500 mb-6">Mi empresa</h2>
            
            {perfil ? (
              <div className="card">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-brown-500">{perfil.razonSocial}</h3>
                    <p className="text-brown-400">RUC: {perfil.ruc}</p>
                  </div>
                  {perfil.isVerified && (
                    <span className="chip-teal">Empresa Inclusiva Verificada</span>
                  )}
                  <span className={`chip ${perfil.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {perfil.isApproved ? 'Aprobada' : 'Pendiente de aprobación'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Sector</label>
                    <p className="text-brown-500">{perfil.sector || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Tamaño</label>
                    <p className="text-brown-500">{perfil.tamaño || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Ciudad</label>
                    <p className="text-brown-500">{perfil.ciudad || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-400 mb-1">Sitio web</label>
                    <p className="text-brown-500">{perfil.sitioWeb || 'No especificado'}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-brown-400 mb-1">Descripción</label>
                  <p className="text-brown-500">{perfil.descripcion || 'No especificada'}</p>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-brown-400 mb-2">Acomodaciones disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {perfil.accommodations?.length > 0 ? (
                      perfil.accommodations.map((acc: string, idx: number) => (
                        <span key={idx} className="chip bg-cream-200 text-brown-500">
                          {acc}
                        </span>
                      ))
                    ) : (
                      <p className="text-brown-400">No especificadas</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-cream-200">
                  <h4 className="font-medium text-brown-500 mb-2">Contacto</h4>
                  <p className="text-brown-500">{perfil.nombreContacto}</p>
                  <p className="text-brown-400">{perfil.cargoContacto}</p>
                  <p className="text-brown-400">{perfil.telefonoContacto}</p>
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

export default EmpresaDashboard;