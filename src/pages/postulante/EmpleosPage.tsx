import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import HeroSearch from '../../components/postulante/empleos/HeroSearch';
import FilterSidebar from '../../components/postulante/empleos/FilterSidebar';
import JobList from '../../components/postulante/empleos/JobList';
import { postulanteService } from '../../services/postulanteService';
import { disabilitiesService } from '../../services/disabilitiesService';
import type { Disability, JobOffer } from '../../components/postulante/empleos/types';

const EmpleosPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [disabilities, setDisabilities] = useState<Disability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('loc') || '');

  const selectedDisabilities = searchParams.getAll('discapacidad');
  const selectedModalities = searchParams.getAll('modalidad');
  const selectedSectorId = searchParams.get('sectorId') || '';
  const selectedCiudadId = searchParams.get('ciudadId') || '';

  useEffect(() => {
    loadDisabilities();
  }, []);

  useEffect(() => {
    loadOffers();
  }, [searchParams]);

  const loadDisabilities = async () => {
    try {
      const data = await disabilitiesService.getAll();
      setDisabilities(data);
    } catch {
      // silent fail
    }
  };

  const selectedDepartamentoId = searchParams.get('departamentoId') || '';

  const loadOffers = async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {
        search: searchParams.get('q') || undefined,
        location: searchParams.get('loc') || undefined,
        modalidad: selectedModalities.length > 0 ? selectedModalities : undefined,
        sectorId: selectedSectorId || undefined,
        ciudadId: selectedCiudadId || undefined,
        departamentoId: selectedDepartamentoId || undefined,  // ← NUEVO
        disabilityIds: selectedDisabilities.length > 0 ? selectedDisabilities : undefined,
      };
      const data = await postulanteService.getJobOffers(filters);
      setOffers(data);
    } catch {
      setError('Error al cargar las ofertas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDepartamentoChange = (departamentoId: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (departamentoId) {
      newParams.set('departamentoId', departamentoId);
    } else {
      newParams.delete('departamentoId');
    }
    
    newParams.delete('ciudadId'); // Reset ciudad
    
    setSearchParams(newParams);
  };

  const updateSearchParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
       console.log('📝 updateSearchParams called with:', updates);
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        newParams.delete(key);
        if (value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v));
        } else {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handleSearch = () => {
    updateSearchParams({ q: searchQuery || null, loc: locationQuery || null });
  };

  const toggleDisability = (id: string) => {
    const next = selectedDisabilities.includes(id)
      ? selectedDisabilities.filter((d) => d !== id)
      : [...selectedDisabilities, id];
    updateSearchParams({ discapacidad: next.length > 0 ? next : null });
  };

  const toggleModality = (m: string) => {
    const next = selectedModalities.includes(m)
      ? selectedModalities.filter((x) => x !== m)
      : [...selectedModalities, m];
    updateSearchParams({ modalidad: next.length > 0 ? next : null });
  };

  const handleSectorChange = (sectorId: string) => {
    updateSearchParams({ sectorId: sectorId || null });
  };

  const handleCiudadChange = (ciudadId: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (ciudadId) {
      newParams.set('ciudadId', ciudadId);
    } else {
      newParams.delete('ciudadId');
    }
    
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSearchParams(new URLSearchParams());
  };

  const handleApply = async (jobOfferId: string) => {
    try {
      await postulanteService.applyToJob(jobOfferId, 'Me interesa esta oferta');
      setSuccessMessage('¡Postulación enviada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al postular');
    }
  };

  const handleViewDetail = (id: string) => {
    navigate(`/postulante/empleos/${id}`);
  };

  return (
    <DashboardLayout>
      <HeroSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        onSearch={handleSearch}
      />

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
      {successMessage && (
        <div className="bg-teal-50 border border-teal-200 text-teal px-4 py-3 rounded-xl mb-6 text-sm">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          disabilities={disabilities}
          selectedDisabilities={selectedDisabilities}
          toggleDisability={toggleDisability}
          selectedModalities={selectedModalities}
          toggleModality={toggleModality}
          selectedSectorId={selectedSectorId}
          setSelectedSectorId={handleSectorChange}
          selectedCiudadId={selectedCiudadId}
          setSelectedCiudadId={handleCiudadChange}
          selectedDepartamentoId={selectedDepartamentoId}
          setSelectedDepartamentoId={handleDepartamentoChange}
          onClear={handleClearFilters}
        />

        <section className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-brown font-sans">
              {loading ? 'Buscando...' : `${offers.length} Empleos encontrados`}
            </h2>
            <div className="flex items-center gap-2 text-brown/50 text-sm">
              <span>Ordenar por:</span>
              <select className="bg-transparent border-none font-bold text-teal focus:ring-0 text-sm cursor-pointer">
                <option>Más recientes</option>
                <option>Compatibilidad</option>
              </select>
            </div>
          </div>

          <JobList
            offers={offers}
            loading={loading}
            onApply={handleApply}
            onViewDetail={handleViewDetail}
            onClearFilters={handleClearFilters}
          />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default EmpleosPage;