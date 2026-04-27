import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Briefcase, ArrowRight, Building2 } from 'lucide-react';
import type { Application } from '../empleos/types';

interface Props {
  application: Application;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  ENVIADO: { label: 'Enviado', color: 'text-teal', bg: 'bg-teal-50', border: 'border-teal' },
  EN_REVISION: { label: 'En revisión', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-400' },
  ENTREVISTA: { label: 'Entrevista', color: 'text-teal', bg: 'bg-teal-50', border: 'border-teal' },
  CONTRATADO: { label: 'Contratado', color: 'text-white', bg: 'bg-teal', border: 'border-teal' },
  RECHAZADO: { label: 'No seleccionado', color: 'text-brown/50', bg: 'bg-cream-100', border: 'border-cream-300' },
};

const PostulacionCard = ({ application }: Props) => {
  const navigate = useNavigate();
  const status = STATUS_CONFIG[application.status] || STATUS_CONFIG.ENVIADO;
  const isClosed = application.status === 'RECHAZADO';

  const daysAgo = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} días`;
  };

  return (
    <div
      className={`group bg-white rounded-2xl p-6 shadow-sm border-l-4 transition-all hover:shadow-md ${
        isClosed ? 'opacity-70 border-cream-300' : status.border
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-cream-50 flex items-center justify-center border border-cream-200 shrink-0">
          {application.jobOffer.empresa.logo ? (
            <img
              src={application.jobOffer.empresa.logo}
              alt={application.jobOffer.empresa.razonSocial}
              className="w-9 h-9 object-contain"
            />
          ) : (
            <Building2 className="w-6 h-6 text-brown/30" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <h3
                onClick={() => navigate(`/postulante/empleos/${application.jobOffer.id}`)}
                className={`text-lg font-bold font-sans transition-colors cursor-pointer ${
                  isClosed ? 'text-brown/60' : 'text-brown group-hover:text-teal'
                }`}
              >
                {application.jobOffer.titulo}
              </h3>
              <p className="text-brown/50 text-sm font-medium">
                {application.jobOffer.empresa.razonSocial}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-brown/50 mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {application.jobOffer.ciudad}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {application.jobOffer.modalidad}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {daysAgo(application.createdAt)}
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/postulante/empleos/${application.jobOffer.id}`)}
            disabled={isClosed}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isClosed
                ? 'text-brown/30 cursor-not-allowed'
                : 'text-teal hover:bg-teal-50 border border-cream-200 hover:border-teal/20'
            }`}
          >
            Ver detalle
            {!isClosed && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostulacionCard;