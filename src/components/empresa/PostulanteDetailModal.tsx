import { useEffect } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Briefcase, FileText, Globe, DollarSign, Loader2, ExternalLink } from 'lucide-react';
import type { Application, ApplicationStatus } from '../../types/application';

interface StatusOption {
  value: string;
  label: string;
  color: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  statusOptions: StatusOption[];
  getStatusLabel: (status: ApplicationStatus) => string;
  getStatusColor: (status: ApplicationStatus) => string;
  onUpdateStatus: (applicationId: string, newStatus: string) => void;
}

const PostulanteDetailModal = ({
  isOpen,
  onClose,
  application,
  statusOptions,
  getStatusLabel,
  getStatusColor,
  onUpdateStatus,
}: Props) => {
  const { postulante, jobOffer, createdAt, status, mensaje } = application;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-brown font-sans">Perfil del postulante</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
              {getStatusLabel(status)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            <X className="w-4 h-4 text-brown" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Header del postulante */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar grande */}
            <div className="shrink-0">
              {postulante.fotoPerfil ? (
                <img
                  src={postulante.fotoPerfil}
                  alt={`${postulante.nombres} ${postulante.apellidos}`}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-cream-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-teal-50 border-2 border-cream-200 flex items-center justify-center text-teal font-bold text-2xl">
                  {getInitials(postulante.nombres, postulante.apellidos)}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold text-brown">
                {postulante.nombres} {postulante.apellidos}
              </h3>
              <p className="text-brown/50 text-sm">
                Postuló a <span className="font-semibold text-brown">{jobOffer.titulo}</span> el {formatDate(createdAt)}
              </p>

              {/* Discapacidades */}
              <div className="flex flex-wrap gap-2 pt-2">
                {postulante.disabilities.map((d) => (
                  <span
                    key={d.id}
                    className="inline-flex items-center gap-1.5 bg-teal-50 text-teal px-3 py-1.5 rounded-full text-sm font-semibold"
                  >
                    <img src={getDisabilityIcon(d.nombre)} alt="" className="w-4 h-4" />
                    {d.nombre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mensaje de postulación */}
          {mensaje && (
            <div className="bg-cream-50 rounded-xl p-4 border-l-4 border-teal">
              <p className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-1">Mensaje de postulación</p>
              <p className="text-brown/80 italic">"{mensaje}"</p>
            </div>
          )}

          {/* Datos de contacto */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Información de contacto</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-cream-50 rounded-xl p-4">
                <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Email</p>
                <p className="text-brown font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal" />
                  {postulante.user.email}
                </p>
              </div>
              {postulante.telefono && (
                <div className="bg-cream-50 rounded-xl p-4">
                  <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Teléfono</p>
                  <p className="text-brown font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal" />
                    {postulante.telefono}
                  </p>
                </div>
              )}
              {postulante.ciudad?.nombre && (
                <div className="bg-cream-50 rounded-xl p-4">
                  <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Ciudad</p>
                  <p className="text-brown font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal" />
                    {postulante.ciudad.nombre}
                  </p>
                </div>
              )}
              {postulante.fechaNacimiento && (
                <div className="bg-cream-50 rounded-xl p-4">
                  <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Fecha de nacimiento</p>
                  <p className="text-brown font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal" />
                    {new Date(postulante.fechaNacimiento).toLocaleDateString('es-PE')}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Sobre mí */}
          {postulante.sobreMi && (
            <section>
              <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Sobre mí</h3>
              <div className="bg-white rounded-xl p-4 border border-cream-200">
                <p className="text-brown/70 leading-relaxed whitespace-pre-line">{postulante.sobreMi}</p>
              </div>
            </section>
          )}

          {/* Habilidades */}
          {postulante.skills && postulante.skills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {postulante.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-teal-50 text-teal px-4 py-2 rounded-full font-medium text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Links y expectativas */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Links y expectativas</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {postulante.linkedin && (
                <a
                  href={postulante.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-cream-50 hover:bg-[#0077B5]/10 transition-colors group border border-transparent hover:border-[#0077B5]/20"
                >
                  <div className="w-10 h-10 bg-[#0077B5]/10 rounded-xl flex items-center justify-center shrink-0">
                    <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brown group-hover:text-[#0077B5]">LinkedIn</p>
                    <p className="text-xs text-brown/50 truncate">Ver perfil profesional</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-brown/30 group-hover:text-[#0077B5]" />
                </a>
              )}
              {postulante.portfolio && (
                <a
                  href={postulante.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-cream-50 hover:bg-teal-50 transition-colors group border border-transparent hover:border-teal/20"
                >
                  <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brown group-hover:text-teal">Portfolio</p>
                    <p className="text-xs text-brown/50 truncate">Ver trabajos</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-brown/30 group-hover:text-teal" />
                </a>
              )}
              {postulante.salarioEsperado && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-cream-50">
                  <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-coral" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brown">Expectativa salarial</p>
                    <p className="text-xs text-brown/50">S/ {postulante.salarioEsperado.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {postulante.cvUrl && (
                <a
                  href={postulante.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-cream-50 hover:bg-teal-50 transition-colors group border border-transparent hover:border-teal/20"
                >
                  <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brown group-hover:text-teal">Currículum</p>
                    <p className="text-xs text-brown/50 truncate">Ver documento</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-brown/30 group-hover:text-teal" />
                </a>
              )}
            </div>
          </section>

          {/* Cambiar estado */}
          <div className="pt-4 border-t border-cream-200">
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-3">Actualizar estado de postulación</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onUpdateStatus(application.id, opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    status === opt.value
                      ? opt.color + ' ring-2 ring-offset-2 ring-teal/30'
                      : 'bg-white text-brown/60 border-cream-200 hover:bg-cream-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostulanteDetailModal;