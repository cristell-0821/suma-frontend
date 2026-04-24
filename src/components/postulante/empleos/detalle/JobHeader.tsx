import { MapPin, Briefcase, DollarSign, Clock, Building2 } from 'lucide-react';
import type { JobOffer } from '../types';

interface Props {
  offer: JobOffer;
  onApply: () => void;
  onSave: () => void;
  isSaved?: boolean;
}

const JobHeader = ({ offer, onApply, onSave, isSaved }: Props) => {
  const modalityLabels: Record<string, string> = {
    REMOTO: 'Remoto',
    HIBRIDO: 'Híbrido',
    PRESENCIAL: 'Presencial',
  };

  return (
    <header className="mb-10">
      <div className="grid lg:grid-cols-3 gap-8 items-end">
        <div className="lg:col-span-2 space-y-5">
          {/* Empresa + Título */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-cream-50 flex items-center justify-center border border-cream-200">
              {offer.empresa.logo ? (
                <img
                  src={offer.empresa.logo}
                  alt={offer.empresa.razonSocial}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-teal" />
              )}
            </div>
            <div>
              <p className="text-teal font-semibold tracking-wide uppercase text-sm">
                {offer.empresa.razonSocial}
                {offer.empresa.isVerified && (
                  <span className="inline-flex items-center gap-1 ml-2 text-xs bg-teal-50 text-teal px-2 py-0.5 rounded-full">
                    Verificada
                  </span>
                )}
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-brown tracking-tight leading-tight font-sans">
                {offer.titulo}
              </h1>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-cream-100 px-4 py-2 rounded-full text-brown/70 text-sm font-medium">
              <MapPin className="w-4 h-4 text-teal" />
              {offer.ciudad} ({modalityLabels[offer.modalidad] || offer.modalidad})
            </div>
            <div className="flex items-center gap-2 bg-cream-100 px-4 py-2 rounded-full text-brown/70 text-sm font-medium">
              <Briefcase className="w-4 h-4 text-teal" />
              {offer.tipoJornada || 'Tiempo completo'}
            </div>
            {offer.salarioMin && (
              <div className="flex items-center gap-2 bg-cream-100 px-4 py-2 rounded-full text-brown/70 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-teal" />
                S/ {offer.salarioMin.toLocaleString()}
                {offer.salarioMax && ` - ${offer.salarioMax.toLocaleString()}`}
              </div>
            )}
            <div className="flex items-center gap-2 bg-cream-100 px-4 py-2 rounded-full text-brown/70 text-sm font-medium">
              <Clock className="w-4 h-4 text-teal" />
              Publicado {daysAgo(offer.createdAt)}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <button
            onClick={onApply}
            className="bg-teal text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-teal-600 active:scale-95 transition-all"
          >
            Postular ahora
          </button>
          <button
            onClick={onSave}
            className={`flex items-center justify-center gap-2 border-2 px-8 py-3 rounded-xl font-semibold transition-all ${
              isSaved
                ? 'border-coral bg-coral-50 text-coral'
                : 'border-cream-200 bg-white text-brown hover:bg-cream-50'
            }`}
          >
            {isSaved ? 'Guardado' : 'Guardar vacante'}
          </button>
        </div>
      </div>
    </header>
  );
};

const daysAgo = (dateStr: string) => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'hoy';
  if (days === 1) return 'ayer';
  return `hace ${days} días`;
};

export default JobHeader;