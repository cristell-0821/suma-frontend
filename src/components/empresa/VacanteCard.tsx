import { useState } from 'react';
import { Edit, Pause, Play, Trash2, Calendar, MapPin, Briefcase, Building2 } from 'lucide-react';
import type { Vacante } from '../../types/empresa';

interface Props {
  vacante: Vacante;
  onEdit: (vacante: Vacante) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (vacante: Vacante) => void;
}

const VacanteCard = ({ vacante, onEdit, onToggle, onDelete, onDuplicate }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = () => {
    if (vacante.isActive) {
      return {
        label: 'Activa',
        dotColor: 'bg-teal',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal',
        borderColor: 'border-l-teal',
      };
    }
    return {
      label: 'Pausada',
      dotColor: 'bg-coral',
      bgColor: 'bg-coral-50',
      textColor: 'text-coral',
      borderColor: 'border-l-coral',
    };
  };

  const status = getStatusConfig();
  const postulantesCount = vacante._count?.applications || 0;
  const fecha = new Date(vacante.createdAt).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Datos de relaciones (con fallback por si no vienen incluidos)
  const ciudadNombre = vacante.ciudad?.nombre || 'Ciudad no especificada';
  const sectorNombre = vacante.sector?.nombre || 'Sector no especificado';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border-l-[6px] ${status.borderColor} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
    >
      {/* Info principal */}
      <div className="flex items-start gap-5 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
          <Briefcase className="w-7 h-7 text-teal" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-brown mb-1 truncate">{vacante.titulo}</h3>
          
          {/* Sector badge */}
          {sectorNombre && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3 h-3 text-teal" />
              <span className="text-xs font-semibold text-teal bg-teal-50 px-2 py-0.5 rounded-full">
                {sectorNombre}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-sm text-brown/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Publicado: {fecha}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {ciudadNombre} ({vacante.modalidad})
            </span>
          </div>

          {vacante.disabilities && vacante.disabilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {vacante.disabilities.map((d) => (
                <span key={d.id} className="bg-cream-100 text-brown/70 px-2 py-0.5 rounded-full text-xs">
                  {d.nombre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats + Acciones */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        {/* Postulantes */}
        <div className="text-center px-4 md:px-6 md:border-x border-cream-200">
          <p className={`text-2xl font-extrabold ${vacante.isActive ? 'text-teal' : 'text-coral'}`}>
            {postulantesCount}
          </p>
          <p className="text-xs uppercase tracking-wider font-bold text-brown/40">Postulantes</p>
        </div>

        {/* Estado + Acciones */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.bgColor} ${status.textColor} flex items-center gap-1.5`}>
            <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
            {status.label}
          </span>

          <div className="flex items-center gap-1">
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(vacante)}
                className="p-2 rounded-full hover:bg-cream-100 text-brown/60 hover:text-brown transition-colors"
                title="Duplicar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onEdit(vacante)}
              className="p-2 rounded-full hover:bg-cream-100 text-brown/60 hover:text-brown transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggle(vacante.id)}
              className={`p-2 rounded-full hover:bg-cream-100 transition-colors ${
                vacante.isActive ? 'text-coral hover:text-coral-600' : 'text-teal hover:text-teal-600'
              }`}
              title={vacante.isActive ? 'Pausar' : 'Reanudar'}
            >
              {vacante.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(vacante.id)}
              className="p-2 rounded-full hover:bg-red-50 text-brown/60 hover:text-red-500 transition-colors"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacanteCard;