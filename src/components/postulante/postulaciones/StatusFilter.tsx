//import { Filter } from 'lucide-react';

interface Props {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

const FILTERS = [
  { key: 'TODAS', label: 'Todas' },
  { key: 'ENVIADO', label: 'Activas' },
  { key: 'ENTREVISTA', label: 'Entrevistas' },
  { key: 'CONTRATADO', label: 'Contratadas' },
  { key: 'RECHAZADO', label: 'Finalizadas' },
];

const StatusFilter = ({ activeFilter, onFilterChange, counts }: Props) => (
  <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-cream-200">
    {FILTERS.map((f) => (
      <button
        key={f.key}
        onClick={() => onFilterChange(f.key)}
        className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
          activeFilter === f.key
            ? 'bg-teal text-white shadow-sm'
            : 'text-brown/60 hover:bg-cream-50 hover:text-brown'
        }`}
      >
        {f.label}
        {counts[f.key] > 0 && (
          <span className={`ml-2 text-xs ${activeFilter === f.key ? 'text-white/80' : 'text-brown/40'}`}>
            {counts[f.key]}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default StatusFilter;