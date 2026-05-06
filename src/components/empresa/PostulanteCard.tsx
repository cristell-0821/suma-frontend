import { Calendar, Eye, Loader2 } from 'lucide-react';
import type { Application } from '@/types/application';

interface StatusOption {
  value: string;
  label: string;
  color: string;
}

interface Props {
  application: Application;
  statusOptions: StatusOption[];
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  onUpdateStatus: (applicationId: string, newStatus: string) => void;
  onViewProfile: (application: Application) => void;
  updatingStatus: boolean;
}

const PostulanteCard = ({
  application,
  statusOptions,
  /* getStatusLabel, */
  getStatusColor,
  onUpdateStatus,
  onViewProfile,
  updatingStatus,
}: Props) => {
  const { postulante, jobOffer, createdAt, status } = application;

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  const getDisabilityIcon = (nombre: string): string => {
    const normalized = nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (normalized.includes('auditiva')) return '/icons/auditiva.svg';
    if (normalized.includes('intelectual')) return '/icons/intelectual.svg';
    if (normalized.includes('motriz') || normalized.includes('fisica')) return '/icons/motriz.svg';
    if (normalized.includes('sordoceguera')) return '/icons/sordoceguera.svg';
    if (normalized.includes('multiple')) return '/icons/multiple.svg';
    if (normalized.includes('autista') || normalized.includes('espectro')) return '/icons/autista.svg';
    if (normalized.includes('psicosocial')) return '/icons/psicosocial.svg';
    if (normalized.includes('visual')) return '/icons/visual.svg';

    return '/icons/visual.svg';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 relative overflow-hidden hover:shadow-md transition-shadow">
      {/* Barra lateral de color según estado */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        status === 'CONTRATADO' ? 'bg-green-500' :
        status === 'RECHAZADO' ? 'bg-red-400' :
        status === 'ENTREVISTA' ? 'bg-blue-400' :
        status === 'EN_REVISION' ? 'bg-yellow-400' :
        'bg-gray-300'
      }`} />

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          {postulante.fotoPerfil ? (
            <img
              src={postulante.fotoPerfil}
              alt={`${postulante.nombres} ${postulante.apellidos}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-cream-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-cream-200 flex items-center justify-center text-teal font-bold text-xl">
              {getInitials(postulante.nombres, postulante.apellidos)}
            </div>
          )}
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Nombre + discapacidades */}
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-bold text-brown">
              {postulante.nombres} {postulante.apellidos}
            </h3>
            {postulante.disabilities.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1.5 bg-teal-50 text-teal px-3 py-1 rounded-full text-xs font-semibold"
              >
                <img
                  src={getDisabilityIcon(d.nombre)}
                  alt=""
                  className="w-3.5 h-3.5"
                />
                {d.nombre}
              </span>
            ))}
          </div>

          {/* Skills */}
          {postulante.skills && postulante.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {postulante.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-cream-100 text-brown/70 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
              {postulante.skills.length > 4 && (
                <span className="bg-cream-100 text-brown/50 px-3 py-1 rounded-full text-sm font-medium">
                  +{postulante.skills.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-brown/50">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Postuló el {formatDate(createdAt)}
            </span>
            <span className="text-brown/30">•</span>
            <span className="font-medium text-brown/60">
              {jobOffer.titulo}
            </span>
            {postulante.ciudad?.nombre && (
              <>
                <span className="text-brown/30">•</span>
                <span>{postulante.ciudad.nombre}</span>
              </>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
          {/* Selector de estado */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onUpdateStatus(application.id, e.target.value)}
              disabled={updatingStatus}
              className={`w-full sm:w-48 px-4 py-3 rounded-xl border font-bold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all disabled:opacity-50 ${getStatusColor(status)}`}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {updatingStatus && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-brown/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Botón ver perfil */}
          <button
            onClick={() => onViewProfile(application)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-teal text-teal font-bold text-sm hover:bg-teal-50 active:scale-[0.98] transition-all"
          >
            <Eye className="w-4 h-4" />
            Ver perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostulanteCard;