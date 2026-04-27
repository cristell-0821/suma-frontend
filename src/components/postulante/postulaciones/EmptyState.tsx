import { useNavigate } from 'react-router-dom';
import { SearchX, Briefcase } from 'lucide-react';

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-10 h-10 text-brown/20" />
      </div>
      <h2 className="text-2xl font-bold text-brown mb-2 font-sans">
        Aún no tienes postulaciones
      </h2>
      <p className="text-brown/50 max-w-sm mb-8">
        ¡El trabajo de tus sueños está a un click de distancia! Explora las vacantes disponibles hoy.
      </p>
      <button
        onClick={() => navigate('/postulante/empleos')}
        className="bg-teal text-white px-8 py-3.5 rounded-xl font-bold hover:bg-teal-600 active:scale-95 transition-all flex items-center gap-2"
      >
        <Briefcase className="w-5 h-5" />
        Explorar empleos
      </button>
    </div>
  );
};

export default EmptyState;