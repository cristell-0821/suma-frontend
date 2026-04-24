import { Briefcase, MapPin } from 'lucide-react';

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  locationQuery: string;
  setLocationQuery: (v: string) => void;
  onSearch: () => void;
}

const HeroSearch = ({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearch,
}: Props) => (
  <section className="mb-12">
    <div className="bg-gradient-to-br from-teal to-teal-600 rounded-2xl p-12 relative overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-6 tracking-tight font-sans">
          Encuentra tu lugar en el tapiz.
        </h1>
        <div className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-full shadow-lg">
          <div className="flex-1 flex items-center px-4 gap-3">
            <Briefcase className="w-5 h-5 text-teal shrink-0" />
            <input
              type="text"
              placeholder="Cargo o palabra clave"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="w-full border-none focus:ring-0 bg-transparent text-brown font-medium text-sm placeholder:text-brown/40 outline-none"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-cream-200 self-center" />
          <div className="flex-1 flex items-center px-4 gap-3">
            <MapPin className="w-5 h-5 text-teal shrink-0" />
            <input
              type="text"
              placeholder="Ciudad o modalidad"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="w-full border-none focus:ring-0 bg-transparent text-brown font-medium text-sm placeholder:text-brown/40 outline-none"
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-coral text-white font-semibold px-8 py-3 rounded-full hover:bg-coral-600 transition-all active:scale-95 text-sm shrink-0"
          >
            Buscar empleos
          </button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-l from-white/30 to-transparent" />
      </div>
    </div>
  </section>
);

export default HeroSearch;