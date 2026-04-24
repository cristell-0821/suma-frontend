import { Users, Accessibility, Eye, Ear, Brain, Hand, PersonStanding } from 'lucide-react';
import type { Disability } from '../types';

interface Props {
  disabilities: Disability[];
}

// Mapeo flexible: busca palabras clave en el nombre
const getIconForDisability = (nombre: string) => {
  const lower = nombre.toLowerCase();
  
  if (lower.includes('visual') || lower.includes('vista') || lower.includes('ceguera')) {
    return Eye;
  }
  if (lower.includes('auditiv') || lower.includes('oído') || lower.includes('sordera')) {
    return Ear;
  }
  if (lower.includes('motriz') || lower.includes('silla') || lower.includes('física') || lower.includes('movilidad')) {
    return Accessibility;
  }
  if (lower.includes('neuro') || lower.includes('autismo') || lower.includes('tdah') || lower.includes('dislexia')) {
    return Brain;
  }
  if (lower.includes('mano') || lower.includes('brazo') || lower.includes('amputación')) {
    return Hand;
  }
  
  // Default
  return PersonStanding;
};

const InclusionSection = ({ disabilities }: Props) => {
  if (!disabilities.length) return null;

  return (
    <section className="bg-teal-50 p-6 md:p-8 rounded-2xl border-l-4 border-teal mb-10">
      <div className="flex items-start gap-4">
        <Users className="w-8 h-8 text-teal shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-bold text-teal mb-3 font-sans">
            Compromiso con la Inclusión
          </h2>
          <p className="text-brown/70 mb-5 leading-relaxed">
            Esta empresa ha diseñado este puesto para ser accesible y adaptado a diferentes necesidades.
          </p>
          <div className="flex flex-wrap gap-2">
            {disabilities.map((d) => {
              const Icon = getIconForDisability(d.nombre);
              return (
                <span
                  key={d.id}
                  className="bg-white text-teal px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-teal/10"
                >
                  <Icon className="w-4 h-4" />
                  {d.nombre}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InclusionSection;