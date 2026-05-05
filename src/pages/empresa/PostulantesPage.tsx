import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { empresaService } from '../../services/empresaService';
import PostulanteCard from '../../components/empresa/PostulanteCard';
import PostulanteDetailModal from '../../components/empresa/PostulanteDetailModal';
import { useAuthStore } from '../../stores/authStore';
import type { Application, ApplicationStatus } from '@/types/application';

const STATUS_OPTIONS = [
  { value: 'ENVIADO', label: 'Enviado', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'EN_REVISION', label: 'En revisión', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'ENTREVISTA', label: 'Entrevista', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'CONTRATADO', label: 'Contratado', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'RECHAZADO', label: 'No seleccionado', color: 'bg-red-50 text-red-700 border-red-200' },
];

const PostulantesPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobOffers, setJobOffers] = useState<{ id: string; titulo: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appsData, offersData] = await Promise.all([
        empresaService.getApplicants(),
        empresaService.getMyJobOffers(),
      ]);
      setApplications(appsData);
      // Extraer ofertas únicas de las aplicaciones para el filtro
      const uniqueOffers = offersData.map((o: any) => ({ id: o.id, titulo: o.titulo }));
      setJobOffers(uniqueOffers);
      setError('');
    } catch {
      setError('Error al cargar los postulantes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId);
    try {
      await empresaService.updateApplicationStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus as Application['status'] } : app
        )
      );
    } catch {
      setError('Error al actualizar el estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewProfile = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const filteredApplications = applications.filter(app => {
    const matchOffer = selectedOffer === 'all' || app.jobOffer.id === selectedOffer;
    const matchStatus = selectedStatus === 'all' || app.status === selectedStatus;
    return matchOffer && matchStatus;
  });

  const getStatusLabel = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.label || status;
  };

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brown font-sans">Postulantes</h1>
            <p className="text-brown/50 mt-1">
              Gestiona el talento diverso que ha aplicado a tus vacantes
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-teal">{applications.length}</p>
            <p className="text-sm text-brown/50">postulaciones totales</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-cream-200 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-brown/50 uppercase tracking-wider mb-1.5">
              Filtrar por vacante
            </label>
            <select
              value={selectedOffer}
              onChange={(e) => setSelectedOffer(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            >
              <option value="all">Todas las vacantes</option>
              {jobOffers.map(offer => (
                <option key={offer.id} value={offer.id}>{offer.titulo}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-brown/50 uppercase tracking-wider mb-1.5">
              Filtrar por estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            >
              <option value="all">Todos los estados</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de postulantes */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-cream-200">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brown/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-brown mb-2">No hay postulantes</h3>
            <p className="text-brown/50 text-sm max-w-md mx-auto">
              {applications.length === 0
                ? 'Aún no hay postulaciones en tus ofertas. ¡Publica una vacante para empezar a recibir candidatos!'
                : 'Ningún postulante coincide con los filtros seleccionados.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <PostulanteCard
                key={app.id}
                application={app}
                statusOptions={STATUS_OPTIONS}
                getStatusLabel={getStatusLabel}
                getStatusColor={getStatusColor}
                onUpdateStatus={handleUpdateStatus}
                onViewProfile={handleViewProfile}
                updatingStatus={updatingStatus === app.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {selectedApplication && (
        <PostulanteDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          statusOptions={STATUS_OPTIONS}
          getStatusLabel={getStatusLabel}
          getStatusColor={getStatusColor}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </DashboardLayout>
  );
};

export default PostulantesPage;