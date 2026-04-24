import { useState, useEffect } from 'react';
import { disabilitiesService } from '../../../services/disabilitiesService';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Step1PostulanteProps {
  onContinue: (data: {
    nombres: string;
    apellidos: string;
    disabilityIds: string[];
  }) => void;
  onBack: () => void;
}

const Step1Postulante = ({ onContinue, onBack }: Step1PostulanteProps) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [selectedDisabilities, setSelectedDisabilities] = useState<string[]>([]);
  const [disabilities, setDisabilities] = useState<any[]>([]);
  //const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDisabilities();
  }, []);

  const loadDisabilities = async () => {
    try {
      const data = await disabilitiesService.getAll();
      setDisabilities(data);
    } catch (err) {
      console.error('Error loading disabilities:', err);
    }
  };

  const toggleDisability = (id: string) => {
    if (selectedDisabilities.includes(id)) {
      setSelectedDisabilities(selectedDisabilities.filter(d => d !== id));
    } else {
      setSelectedDisabilities([...selectedDisabilities, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !apellidos.trim() || selectedDisabilities.length === 0) {
      return;
    }
    onContinue({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      disabilityIds: selectedDisabilities,
    });
  };

  // Función para mapear nombre → ícono SVG
  const getIconPath = (nombre: string): string => {
   const normalized = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (normalized.includes('auditiva')) return '/icons/auditiva.svg';
    if (normalized.includes('intelectual')) return '/icons/intelectual.svg';
    if (normalized.includes('motriz') || normalized.includes('fisica')) return '/icons/motriz.svg';
    if (normalized.includes('sordoceguera')) return '/icons/sordoceguera.svg';
    if (normalized.includes('multiple')) return '/icons/multiple.svg';
    if (normalized.includes('autista') || normalized.includes('espectro')) return '/icons/autista.svg';
    if (normalized.includes('psicosocial')) return '/icons/psicosocial.svg';
    if (normalized.includes('visual')) return '/icons/visual.svg';

    return '/icons/visual.svg';
  };

  const progress = 50;

  const navigate = useNavigate();
  const goToLogin = () => { navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#fff8f1] text-[#201b0f] relative">
      {/* Regresar */}
      <button 
        onClick={onBack}
        className="
            absolute top-4 left-4 z-50
            text-[#1D9E75]
            active:scale-95 transition
        "
        >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={goToLogin}
          className="absolute top-4 right-4 z-50 text-teal font-bold font-['Plus_Jakarta_Sans'] hover:underline transition-all"
        >
          Ya tengo cuenta
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[#a8380f] font-bold text-sm tracking-widest uppercase">
              Progreso del Registro
            </span>
            <span className="text-[#a8380f] font-bold text-2xl">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-[#f3e7d3] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#fd7549] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-6">
          <div className="absolute -top-12 -right-8 w-64 h-64 bg-[#86f8c9]/20 rounded-full blur-3xl -z-10"></div>
          <h2 className="text-5xl font-extrabold text-[#00694c] mb-4 leading-tight font-['Plus_Jakarta_Sans']">
            Comienza tu camino
          </h2>
          {/* <p className="text-xl text-[#3d4943] font-medium max-w-2xl">
            Cuéntanos sobre ti para personalizar tu experiencia
          </p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Bento */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[#201b0f] font-semibold ml-2">Nombres</label>
              <input
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="w-full px-6 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all text-lg font-medium placeholder:text-[#6d7a73]/50 outline-none"
                placeholder="Ej. Ana María"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[#201b0f] font-semibold ml-2">Apellidos</label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="w-full px-6 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all text-lg font-medium placeholder:text-[#6d7a73]/50 outline-none"
                placeholder="Ej. García López"
                required
              />
            </div>
          </section>

          {/* Disability Selection */}
          <section className="space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-[#201b0f] font-['Plus_Jakarta_Sans']">
                ¿Con qué tipo de discapacidad te identificas?
              </h3>
              <p className="text-[#3d4943]">
                Selecciona las opciones que mejor describan tu situación actual.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {disabilities.map((disability) => {
                const isSelected = selectedDisabilities.includes(disability.id);
                const iconPath = getIconPath(disability.nombre);

                return (
                <button
                    key={disability.id}
                    type="button"
                    onClick={() => toggleDisability(disability.id)}
                    className={`
                    group relative flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer transition-all border-l-4 shadow-sm
                    ${isSelected 
                        ? 'bg-white border-[#00694c]' 
                        : 'bg-white border-transparent hover:bg-[#f8ecd8]'
                    }
                    `}
                >
                    {/* Icono */}
                    <div className="mb-3 transition-transform group-hover:scale-110 text-[#00694c]">
                    <img
                        src={iconPath}
                        alt={disability.nombre}
                        className="w-10 h-10 mb-3 transition-transform group-hover:scale-110"
                    />
                    </div>

                    <span className="text-center font-bold text-sm text-[#201b0f]">
                    {disability.nombre}
                    </span>

                    {/* CheckCircle - solo visible cuando está seleccionado */}
                    <div className={`absolute top-2 right-2 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                    <CheckCircle className="w-5 h-5 text-[#00694c]" />
                    </div>
                </button>
                );
            })}
            </div>
          </section>

          {/* Navigation Actions */}
          <div className="sticky bottom-0 left-0 w-full bg-[#fff8f1]/90 backdrop-blur-md border-t border-[#f3e7d3] mt-8">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                <p className="hidden sm:block text-[#3d4943] italic text-sm">
                Tus datos están protegidos
                </p>

                <button
                type="submit"
                disabled={!nombres.trim() || !apellidos.trim() || selectedDisabilities.length === 0}
                className={`
                    font-bold text-lg px-8 py-4 rounded-xl flex items-center gap-2 transition-all shadow-md
                    ${nombres.trim() && apellidos.trim() && selectedDisabilities.length > 0
                    ? 'bg-[#fd7549] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                `}
                >
                Siguiente
                <ArrowRight className="w-5 h-5" />
                </button>
            </div>
            </div>
        </form>
      </main>
    </div>
  );
};

export default Step1Postulante;