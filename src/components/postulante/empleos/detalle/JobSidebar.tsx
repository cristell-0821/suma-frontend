import { Building2, Heart } from 'lucide-react';
import type { JobOffer } from '../types';
import { Link } from 'react-router-dom';

interface Props {
  offer: JobOffer;
}

const JobSidebar = ({ offer }: Props) => {
  /* const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${offer.titulo} - ${offer.empresa.razonSocial}`,
        text: offer.descripcion.slice(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }; */

  return (
    <aside className="space-y-6">
      {/* Info Empresa */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
        <h3 className="text-lg font-bold text-brown mb-4 font-sans">Sobre la empresa</h3>
        
        <div className="flex items-center gap-3 mb-4">
          {offer.empresa.logoUrl ? (
            <img src={offer.empresa.logoUrl} className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-brown/30" />
            </div>
          )}
          <div>
            <p className="font-bold text-brown text-sm">{offer.empresa.razonSocial}</p>
            {offer.empresa.isVerified && (
              <span className="text-xs text-teal font-medium">✓ Verificada</span>
            )}
          </div>
        </div>

        {offer.empresa.descripcion && (
          <p className="text-brown/60 text-sm leading-relaxed mb-4">
            {offer.empresa.descripcion.slice(0, 120)}...
          </p>
        )}

        <Link
          to={`/empresas/${offer.empresa.id}`}
          className="w-full flex items-center justify-center gap-2 bg-cream-50 text-brown py-2.5 rounded-xl hover:bg-cream-100 transition-colors text-sm font-medium"
        >
          Ver perfil completo
        </Link>
      </div>

      {/* Compartir */}
      {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
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
      </div> */}

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