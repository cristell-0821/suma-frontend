import { ListFilter, ArrowRight } from 'lucide-react';
import type { Disability } from './types';

interface Props {
  disabilities: Disability[];
  selectedDisabilities: string[];
  toggleDisability: (id: string) => void;
  selectedModalities: string[];
  toggleModality: (m: string) => void;
  selectedSector: string;
  setSelectedSector: (s: string) => void;
  onClear: () => void;
}

const MODALITIES = [
  { value: 'REMOTO', label: 'Remoto' },
  { value: 'HIBRIDO', label: 'Híbrido' },
  { value: 'PRESENCIAL', label: 'Presencial' },
];

const SECTORS = ['Tecnología', 'Educación', 'Salud', 'Finanzas', 'Administrativo', 'Ventas', 'Otro'];

const FilterSidebar = ({
  disabilities,
  selectedDisabilities,
  toggleDisability,
  selectedModalities,
  toggleModality,
  selectedSector,
  setSelectedSector,
  onClear,
}: Props) => (
  <aside className="w-full md:w-80 space-y-6">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-200">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-brown font-sans">
        <ListFilter className="w-5 h-5 text-brown" />
        Filtros
      </h3>

      {/* Accesibilidad */}
      <div className="mb-8">
        <p className="font-bold text-xs uppercase tracking-wider text-teal mb-3 font-sans">Accesibilidad</p>
        <div className="flex flex-wrap gap-2">
          {disabilities.map((d) => (
            <button
              key={d.id}
              onClick={() => toggleDisability(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDisabilities.includes(d.id)
                  ? 'bg-teal-50 text-teal border border-teal/20'
                  : 'bg-cream-50 text-brown/60 border border-cream-200 hover:bg-teal-50 hover:text-teal'
              }`}
            >
              {d.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Modalidad */}
      <div className="mb-8">
        <p className="font-bold text-xs uppercase tracking-wider text-teal mb-3 font-sans">Modalidad</p>
        <div className="space-y-2">
          {MODALITIES.map((m) => (
            <label key={m.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedModalities.includes(m.value)}
                onChange={() => toggleModality(m.value)}
                className="w-4 h-4 rounded border-cream-300 text-teal focus:ring-teal/20"
              />
              <span className="text-sm text-brown/70 group-hover:text-teal transition-colors">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sector */}
      <div className="mb-6">
        <p className="font-bold text-xs uppercase tracking-wider text-teal mb-3 font-sans">Sector</p>
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="w-full bg-cream-50 border border-cream-200 rounded-xl p-2.5 text-brown text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
        >
          <option value="">Todos los sectores</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onClear}
        className="w-full py-2.5 text-center text-teal font-semibold text-sm hover:underline decoration-2 underline-offset-4 transition-all"
      >
        Limpiar todos los filtros
      </button>
    </div>

    {/* Featured Card */}
    <div className="bg-coral text-white p-6 rounded-2xl">
      <p className="text-xs font-bold uppercase mb-2 opacity-80">Consejo de Suma</p>
      <h4 className="text-lg font-bold mb-3 leading-tight font-sans">Muestra tu potencial real.</h4>
      <p className="mb-4 opacity-90 text-sm">Las empresas en Suma buscan tu talento único más allá de las etiquetas tradicionales.</p>
      <button className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all text-sm">
        Ver guía de perfil <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </aside>
);

export default FilterSidebar;