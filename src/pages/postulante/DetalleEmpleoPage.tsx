import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import JobHeader from '../../components/postulante/empleos/detalle/JobHeader';
import InclusionSection from '../../components/postulante/empleos/detalle/InclusionSection';
import JobDescription from '../../components/postulante/empleos/detalle/JobDescription';
import JobSidebar from '../../components/postulante/empleos/detalle/JobSidebar';
import MobileActionBar from '../../components/postulante/empleos/detalle/MobileActionBar';
import { postulanteService } from '../../services/postulanteService';
import type { JobOffer } from '../../components/postulante/empleos/types';

const DetalleEmpleoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) loadOffer(id);
  }, [id]);

  const loadOffer = async (offerId: string) => {
    setLoading(true);
    try {
      const data = await postulanteService.getJobOfferById(offerId);
      setOffer(data);
    } catch {
      setError('No se pudo cargar la oferta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!id) return;
    try {
      await postulanteService.applyToJob(id, 'Me interesa esta oferta');
      setSuccessMessage('¡Postulación enviada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al postular');
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
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

  if (error || !offer) {
    return (
      <DashboardLayout>
        <div className="text-center py-32">
          <p className="text-brown/40 text-lg">{error || 'Oferta no encontrada'}</p>
          <button
            onClick={() => navigate('/postulante/empleos')}
            className="mt-4 text-teal font-semibold hover:underline"
          >
            Volver a empleos
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="pb-20 md:pb-0">
        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              ×
            </button>
          </div>
        )}
        {successMessage && (
          <div className="bg-teal-50 border border-teal-200 text-teal px-4 py-3 rounded-xl mb-6 text-sm">
            {successMessage}
          </div>
        )}

        <JobHeader
          offer={offer}
          onApply={handleApply}
          onSave={handleSave}
          isSaved={isSaved}
        />

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <InclusionSection disabilities={offer.disabilities} />
            <JobDescription
              descripcion={offer.descripcion}
              funciones={offer.funciones || 'No especificado'}
              requisitos={offer.requisitos || 'No especificado'}
            />
          </div>

          <div className="lg:col-span-4">
            <JobSidebar offer={offer} />
          </div>
        </div>
      </div>

      <MobileActionBar
        onApply={handleApply}
        onSave={handleSave}
        isSaved={isSaved}
      />
    </DashboardLayout>
  );
};

export default DetalleEmpleoPage;