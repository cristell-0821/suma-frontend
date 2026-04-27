import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusFilter from '../../components/postulante/postulaciones/StatusFilter';
import PostulacionCard from '../../components/postulante/postulaciones/PostulacionCard';
import EmptyState from '../../components/postulante/postulaciones/EmptyState';
import { postulanteService } from '../../services/postulanteService';
import type { Application } from '../../components/postulante/empleos/types';

const PostulacionesPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filtered, setFiltered] = useState<Application[]>([]);
  const [activeFilter, setActiveFilter] = useState('TODAS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (activeFilter === 'TODAS') {
      setFiltered(applications);
    } else {
      setFiltered(applications.filter((a) => a.status === activeFilter));
    }
  }, [activeFilter, applications]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await postulanteService.getMyApplications();
      setApplications(data);
      setFiltered(data);
    } catch {
      setError('Error al cargar tus postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    TODAS: applications.length,
    ENVIADO: applications.filter((a) => a.status === 'ENVIADO').length,
    ENTREVISTA: applications.filter((a) => a.status === 'ENTREVISTA').length,
    CONTRATADO: applications.filter((a) => a.status === 'CONTRATADO').length,
    RECHAZADO: applications.filter((a) => a.status === 'RECHAZADO').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-brown/40 text-sm mb-3">
              <span>Inicio</span>
              <span>/</span>
              <span className="font-semibold text-brown">Mis Postulaciones</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brown tracking-tight leading-tight font-sans">
              Gestiona tu futuro, <br />
              <span className="text-teal">paso a paso.</span>
            </h1>
            <p className="text-lg text-brown/60 mt-4 max-w-xl">
              Aquí encontrarás el seguimiento detallado de todas tus aplicaciones.
            </p>
          </div>
        </div>

        {/* Filters */}
        <StatusFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <PostulacionCard key={app.id} application={app} />
            ))}
          </div>
        )}

        {/* Pagination (si hay muchas) */}
        {filtered.length > 10 && (
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2].map((p) => (
              <button
                key={p}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${
                  p === 1 ? 'bg-teal text-white' : 'bg-cream-100 text-teal hover:bg-teal-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PostulacionesPage;