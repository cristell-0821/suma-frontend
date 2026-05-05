import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import VacanteCard from '../../components/empresa/VacanteCard';
import { empresaService } from '../../services/empresaService';
import type { Vacante } from '../../types/empresa';
import VacanteFormModal from '../../components/empresa/VacanteFormModal';

type FilterStatus = 'todos' | 'activa' | 'pausada';

const VacantesPage = () => {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVacante, setEditingVacante] = useState<Vacante | null>(null);

  useEffect(() => {
    loadVacantes();
  }, []);

  const loadVacantes = async () => {
    setLoading(true);
    try {
      const data = await empresaService.getMyJobOffers();
      setVacantes(data);
      setError('');
    } catch {
      setError('Error al cargar las vacantes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await empresaService.toggleJobOffer(id);
      await loadVacantes();
    } catch {
      setError('Error al cambiar el estado');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta vacante? Esta acción no se puede deshacer.')) return;
    
    try {
      await empresaService.deleteJobOffer(id);
      await loadVacantes();
    } catch {
      setError('Error al eliminar la vacante');
    }
  };

  const handleEdit = (vacante: Vacante) => {
    setEditingVacante(vacante);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingVacante(null);
    setIsFormOpen(true);
  };

  const filteredVacantes = vacantes.filter((v) => {
    const ciudadNombre = v.ciudad?.nombre?.toLowerCase() || '';
    const sectorNombre = v.sector?.nombre?.toLowerCase() || '';
    const tituloLower = v.titulo.toLowerCase();
    const queryLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      tituloLower.includes(queryLower) ||
      ciudadNombre.includes(queryLower) ||
      sectorNombre.includes(queryLower);
    
    const matchesStatus = 
      statusFilter === 'todos' ? true :
      statusFilter === 'activa' ? v.isActive :
      !v.isActive;
    
    return matchesSearch && matchesStatus;
  });

  const activasCount = vacantes.filter(v => v.isActive).length;
  const pausadasCount = vacantes.filter(v => !v.isActive).length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-brown font-sans">
              Mis Vacantes
            </h1>
            <p className="text-brown/60 text-lg">
              Gestiona tus procesos de selección con un enfoque humano e inclusivo.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-teal text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-600 active:scale-95 transition-all shadow-lg shadow-teal/20 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Publicar Nueva Vacante
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-cream-50 p-6 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, ciudad o sector..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-none bg-white text-brown focus:ring-2 focus:ring-teal/30 shadow-sm"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="px-6 py-3.5 rounded-xl border-none bg-white text-brown focus:ring-2 focus:ring-teal/30 shadow-sm appearance-none cursor-pointer"
              >
                <option value="todos">Estado: Todos ({vacantes.length})</option>
                <option value="activa">Activas ({activasCount})</option>
                <option value="pausada">Pausadas ({pausadasCount})</option>
              </select>
              <button className="bg-cream-100 px-6 py-3.5 rounded-xl font-medium flex items-center gap-2 hover:bg-cream-200 transition-all text-brown">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')} className="font-bold">×</button>
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-teal animate-spin" />
          </div>
        ) : filteredVacantes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brown/40 text-lg mb-4">
              {searchQuery || statusFilter !== 'todos'
                ? 'No hay vacantes que coincidan con tu búsqueda'
                : 'Aún no has publicado ninguna vacante'}
            </p>
            {!searchQuery && statusFilter === 'todos' && (
              <button
                onClick={handleCreate}
                className="bg-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition-all"
              >
                Publicar primera vacante
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVacantes.map((vacante) => (
              <VacanteCard
                key={vacante.id}
                vacante={vacante}
                onEdit={handleEdit}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && vacantes.length > 0 && (
          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-cream-50 rounded-2xl">
            <p className="text-brown/60">
              Mostrando <span className="font-bold text-brown">{filteredVacantes.length}</span> de{' '}
              <span className="font-bold text-brown">{vacantes.length}</span> vacantes
            </p>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal" />
                {activasCount} Activas
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral" />
                {pausadasCount} Pausadas
              </span>
            </div>
          </div>
        )}
      </div>

      <VacanteFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVacante(null);
        }}
        onSuccess={loadVacantes}
        editingVacante={editingVacante}
      />
    </DashboardLayout>
  );
};

export default VacantesPage;