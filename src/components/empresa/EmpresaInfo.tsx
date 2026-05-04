import { BookOpen, MapPin, Users, Globe, Building2 } from 'lucide-react';
import type { EmpresaProfile } from '../../services/empresaService';

interface Props {
  empresa: EmpresaProfile;
}

const EmpresaInfo = ({ empresa }: Props) => {
  const stats = [
    { 
      icon: Building2, 
      label: 'Sector', 
      value: empresa.sector?.nombre || 'No especificado' 
    },
    { 
      icon: Users, 
      label: 'Tamaño', 
      value: empresa.tamaño || 'No especificado' 
    },
    { 
      icon: MapPin, 
      label: 'Sede', 
      value: empresa.ciudad?.nombre || 'No especificado' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Descripción */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-teal" />
        <h2 className="text-xl font-bold text-brown mb-6 flex items-center gap-2 font-sans">
          <BookOpen className="w-5 h-5 text-teal" />
          Nuestra Cultura y Propósito
        </h2>
        <div className="space-y-4 text-brown/70 leading-relaxed">
          {empresa.descripcion ? (
            <p>{empresa.descripcion}</p>
          ) : (
            <p className="italic text-brown/40">
              Aún no has agregado una descripción. Edita tu perfil para contarle a los postulantes sobre tu empresa.
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-cream-50 p-6 rounded-2xl text-center border-b-4 border-teal"
          >
            <stat.icon className="w-6 h-6 text-teal mx-auto mb-2" />
            <h4 className="text-xs font-bold text-brown/50 uppercase tracking-wider mb-1">
              {stat.label}
            </h4>
            <p className="text-lg font-bold text-brown">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Sitio web */}
      {empresa.sitioWeb && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
          <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-2">
            Sitio web
          </h3>
          <a
            href={empresa.sitioWeb}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:text-teal-700 font-medium flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {empresa.sitioWeb}
          </a>
        </div>
      )}
    </div>
  );
};

export default EmpresaInfo;