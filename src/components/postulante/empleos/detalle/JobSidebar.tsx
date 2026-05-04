import { Building2, Globe, Heart, Link2, Mail } from 'lucide-react';
import type { JobOffer } from '../types';

interface Props {
  offer: JobOffer;
}

const JobSidebar = ({ offer }: Props) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${offer.titulo} - ${offer.empresa.razonSocial}`,
        text: offer.descripcion.slice(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // ✅ Extraer string ANTES de JSX
  const sectorNombre = typeof offer.sector === 'string'
    ? offer.sector
    : offer.sector?.nombre || 'Sector no especificado';

  return (
    <aside className="space-y-6">
      {/* Info Empresa */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
        <h3 className="text-lg font-bold text-brown mb-4 font-sans">Sobre la empresa</h3>
        <p className="text-brown/60 text-sm leading-relaxed mb-5">
          {offer.empresa.razonSocial} es una empresa comprometida con la diversidad e inclusión laboral.
        </p>
        <div className="space-y-3">
          {offer.empresa.ruc && (
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="w-4 h-4 text-coral" />
              <span className="text-brown/70">RUC: {offer.empresa.ruc}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Globe className="w-4 h-4 text-coral" />
            <span className="text-brown/70">{sectorNombre}</span>
          </div>
        </div>
      </div>

      {/* Compartir */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
        <h3 className="text-lg font-bold text-brown mb-4 font-sans">Compartir</h3>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-cream-50 text-brown py-2.5 rounded-xl hover:bg-cream-100 transition-colors text-sm font-medium"
          >
            <Link2 className="w-4 h-4" />
            Copiar link
          </button>
          <button
            onClick={() =>
              window.open(
                `mailto:?subject=${encodeURIComponent(offer.titulo)}&body=${encodeURIComponent(
                  window.location.href
                )}`
              )
            }
            className="flex-1 flex items-center justify-center gap-2 bg-cream-50 text-brown py-2.5 rounded-xl hover:bg-cream-100 transition-colors text-sm font-medium"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>
      </div>

      {/* Ayuda */}
      <div className="bg-coral text-white p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-2 font-sans">¿Necesitas ayuda?</h3>
        <p className="text-sm opacity-90 mb-4">
          Si tienes dudas sobre este puesto o necesitas ajustes en el proceso de postulación, contáctanos.
        </p>
        <a
          href="https://wa.me/51977972282"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all"
        >
          Contactar soporte <Heart className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
};

export default JobSidebar;