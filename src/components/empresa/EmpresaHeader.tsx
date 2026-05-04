import { useState } from 'react';
import { Pencil, Building2, CheckCircle } from 'lucide-react';
import type { EmpresaProfile } from '../../services/empresaService';

interface Props {
  empresa: EmpresaProfile;
  onEdit: () => void;
  onLogoClick?: () => void;
  onPortadaClick?: () => void;
}

const EmpresaHeader = ({ empresa, onEdit, onLogoClick, onPortadaClick }: Props) => {
  const [hoverLogo, setHoverLogo] = useState(false);
  const [hoverPortada, setHoverPortada] = useState(false);

  return (
    <section className="mb-10">
      {/* Portada */}
      <div
        className="relative h-48 md:h-64 w-full overflow-hidden rounded-t-2xl cursor-pointer group"
        onMouseEnter={() => setHoverPortada(true)}
        onMouseLeave={() => setHoverPortada(false)}
        onClick={onPortadaClick}
      >
        {empresa.portadaUrl ? (
          <img
            src={empresa.portadaUrl}
            alt="Portada"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal to-teal-700" />
        )}
        
        {/* Overlay hover */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${
            hoverPortada ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Pencil className="w-8 h-8 text-white" />
        </div>

        

        {/* Gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Info + Logo */}
      <div >
        {/* Franja — mismo ancho que portada, color correcto */}
        <div
          className="rounded-b-2xl shadow-sm px-6 py-4 flex flex-col md:flex-row items-center gap-6"
          style={{ backgroundColor: '#ADA79D' }}
        >
          
          {/* Logo — sobresale hacia arriba */}
          <button
            type="button"
            onClick={onLogoClick}
            onMouseEnter={() => setHoverLogo(true)}
            onMouseLeave={() => setHoverLogo(false)}
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-white shrink-0 cursor-pointer transition-transform hover:scale-105 -mt-14 md:-mt-16"
          >
            {empresa.logoUrl ? (
              <img
                src={empresa.logoUrl}
                alt={empresa.razonSocial}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-cream-100 flex items-center justify-center">
                <Building2 className="w-12 h-12 md:w-16 md:h-16 text-cream-300" />
              </div>
            )}
            <div
              className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${
                hoverLogo ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Pencil className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-brown tracking-tight font-sans">
                {empresa.razonSocial || 'Mi Empresa'}
              </h1>
              {empresa.isVerified && (
                <span className="bg-teal-50 text-teal px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Empresa Inclusiva Verificada
                </span>
              )}
            </div>
            <p className="text-sm text-brown/60 font-medium truncate">
              {empresa.descripcion?.slice(0, 100) || 'Completa tu perfil de empresa'}
              {empresa.descripcion && empresa.descripcion.length > 100 ? '...' : ''}
            </p>
          </div>

          {/* Botón editar */}
          <button
            onClick={onEdit}
            className="bg-coral text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-coral-600 active:scale-95 transition-all shadow-lg shrink-0"
          >
            <Pencil className="w-4 h-4" />
            Editar Perfil
          </button>
        </div>
      </div>
    </section>
  );
};

export default EmpresaHeader;