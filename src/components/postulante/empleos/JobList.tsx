import { GlobeOff } from 'lucide-react';
import JobCard from './JobCard';
import type { JobOffer } from './types';

interface Props {
  offers: JobOffer[];
  loading: boolean;
  onApply: (id: string) => void;
  onViewDetail: (id: string) => void;
  onClearFilters: () => void;
}

const Pagination = () => (
  <div className="mt-10 flex justify-center gap-2">
    {[1, 2, 3].map((p) => (
      <button
        key={p}
        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
          p === 1 ? 'bg-teal text-white' : 'bg-cream-100 text-teal hover:bg-teal-50'
        }`}
      >
        {p}
      </button>
    ))}
    <span className="flex items-center px-2 text-brown/40">...</span>
    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-cream-100 text-teal hover:bg-teal-50 font-bold text-sm transition-all">
      12
    </button>
  </div>
);

const JobList = ({ offers, loading, onApply, onViewDetail, onClearFilters }: Props) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal" />
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="text-center py-20">
        <GlobeOff className="w-16 h-16 text-brown/15 mb-4 mx-auto" />
        <p className="text-brown/40 font-medium">No encontramos empleos con estos filtros</p>
        <button
          onClick={onClearFilters}
          className="mt-4 text-teal font-semibold text-sm hover:underline"
        >
          Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {offers.map((offer) => (
          <JobCard
            key={offer.id}
            offer={offer}
            onApply={onApply}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
      <Pagination />
    </>
  );
};

export default JobList;