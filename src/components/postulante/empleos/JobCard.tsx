import { Briefcase, Globe, House, Building2, Timer, DollarSign, ArrowRight, MapPin } from 'lucide-react';
import type { JobOffer } from './types';
import type { LucideIcon } from 'lucide-react';

interface Props {
  offer: JobOffer;
  onApply: (id: string) => void;
  onViewDetail: (id: string) => void;
}

const MODALITY_CONFIG: Record<string, { icon: LucideIcon; label: string }> = {
  REMOTO: { icon: Globe, label: '100% Remoto' },
  HIBRIDO: { icon: House, label: 'Híbrido' },
  PRESENCIAL: { icon: Building2, label: 'Presencial' },
};

const getAccessibilityIcon = (feature: string): string => {
  const lower = feature.toLowerCase();
  
  if (lower.includes('visual') || lower.includes('vista')) return 'visibility';
  if (lower.includes('auditiv') || lower.includes('oído')) return 'hearing';
  if (lower.includes('motriz') || lower.includes('silla') || lower.includes('física')) return 'accessible';
  if (lower.includes('neuro') || lower.includes('autismo')) return 'psychology';
  
  return 'accessible';
};

const daysAgo = (dateStr: string) => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
};

const JobCard = ({ offer, onApply, onViewDetail }: Props) => {
  const modality = MODALITY_CONFIG[offer.modalidad] || { icon: Briefcase, label: offer.modalidad };
  const ModalityIcon = modality.icon;

  // Datos de relaciones (con fallback)
  const ciudadNombre = offer.ciudad?.nombre || 'Ubicación no especificada';
  const sectorNombre = offer.sector?.nombre || '';

  return (
    <article
      className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border-l-4 ${
        offer.isRecommended ? 'border-teal' : 'border-transparent'
      } group hover:shadow-lg transition-all`}
    >
      <div className="flex gap-5">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-cream-50 flex items-center justify-center flex-shrink-0 border border-cream-200">
          {offer.empresa.logoUrl ? ( 
            <img src={offer.empresa.logoUrl} alt={offer.empresa.razonSocial} className="w-13 h-13 object-contain rounded-xl" />
          ) : (
            <Briefcase className="w-6 h-6 text-brown/30" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3 mb-1">
            <div className="min-w-0">
              <h3
                onClick={() => onViewDetail(offer.id)}
                className="text-xl font-bold text-brown font-sans group-hover:text-teal transition-colors cursor-pointer truncate"
              >
                {offer.titulo}
              </h3>
              <p className="text-brown/50 text-sm font-medium flex items-center gap-1">
                {offer.empresa.razonSocial} 
                <span className="text-brown/30">•</span>
                <MapPin className="w-3 h-3" />
                {ciudadNombre}
              </p>
            </div>
            {offer.isRecommended && (
              <span className="bg-teal-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal flex-shrink-0">
                Recomendado
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {sectorNombre && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 rounded-full text-xs font-medium text-teal border border-teal/20">
                {sectorNombre}
              </span>
            )}
            <span className="flex items-center gap-1 px-2.5 py-1 bg-cream-50 rounded-full text-xs font-medium text-brown/70 border border-cream-200">
              <ModalityIcon className="w-3.5 h-3.5 text-teal" />
              {modality.label}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-cream-50 rounded-full text-xs font-medium text-brown/70 border border-cream-200">
              <Timer className="w-3.5 h-3.5 text-teal" />
              {offer.tipoJornada || 'Tiempo completo'}
            </span>
            {offer.salarioMin && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-cream-50 rounded-full text-xs font-medium text-brown/70 border border-cream-200">
                <DollarSign className="w-3.5 h-3.5 text-teal" />
                S/ {offer.salarioMin.toLocaleString()}
                {offer.salarioMax && ` - ${offer.salarioMax.toLocaleString()}`}
              </span>
            )}
            <div className="h-4 w-px bg-cream-200 self-center mx-1" />
            {offer.accesibilidadFeatures?.map((feature, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2.5 py-1 bg-coral-50 text-coral font-bold rounded-full text-xs"
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {getAccessibilityIcon(feature)}
                </span>
                {feature}
              </span>
            ))}
          </div>

          <p className="mt-4 text-brown/60 text-sm line-clamp-2 leading-relaxed">
            {offer.descripcion}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-cream-100 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs text-brown/40">{daysAgo(offer.createdAt)}</span>
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetail(offer.id)}
            className="text-teal font-semibold text-sm hover:underline decoration-2 underline-offset-4 px-4 py-2"
          >
            Ver detalle
          </button>
          <button
            onClick={() => onApply(offer.id)}
            className="bg-teal text-white font-bold px-6 py-2.5 rounded-full hover:bg-teal-600 hover:shadow-md transition-all active:scale-95 text-sm flex items-center gap-2"
          >
            Postular
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default JobCard;