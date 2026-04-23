import { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, FileText, User, Users, MapPin } from 'lucide-react';

interface Step1EmpresaProps {
  onContinue: (data: {
    razonSocial: string;
    ruc: string;
    sector: string;
    tamaño: string;
    ciudad: string;
  }) => void;
  onBack: () => void;
}

const TAMAÑOS = ['Pequeña (1-10)', 'Mediana (11-50)', 'Grande (51-200)', 'Corporativo (200+)'];
const SECTORES = ['Tecnología', 'Salud', 'Educación', 'Manufactura', 'Retail', 'Servicios', 'Finanzas', 'Otro'];

const Step1Empresa = ({ onContinue, onBack }: Step1EmpresaProps) => {
  const [formData, setFormData] = useState({
    razonSocial: '',
    ruc: '',
    sector: '',
    tamaño: '',
    ciudad: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.razonSocial.trim() || !formData.ruc.trim() || !formData.sector || !formData.tamaño || !formData.ciudad.trim()) {
      return;
    }
    onContinue({
      razonSocial: formData.razonSocial.trim(),
      ruc: formData.ruc.trim(),
      sector: formData.sector,
      tamaño: formData.tamaño,
      ciudad: formData.ciudad.trim(),
    });
  };

  const progress = 50;

  return (
    <div className="min-h-screen bg-[#fff8f1] text-[#201b0f] flex flex-col">
      {/* Header */}
      <header className="bg-[#fff8f1] flex items-center justify-between px-6 py-4 w-full sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-[#1D9E75] cursor-pointer active:scale-95 duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold tracking-tight text-[#1D9E75]">
            Registro de Empresa
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-[#a8380f] font-bold font-['Plus_Jakarta_Sans']">Paso 1</span>
          <span className="text-stone-500 font-['Plus_Jakarta_Sans']">Paso 2</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-4 flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="mb-6 shrink-0">
          <div className="flex justify-between items-end mb-2">
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

        {/* Hero */}
        <div className="mb-6 shrink-0">
          <h2 className="text-4xl font-extrabold text-[#00694c] mb-2 leading-tight font-['Plus_Jakarta_Sans']">
            Datos de tu empresa
          </h2>
          <p className="text-lg text-[#3d4943]">
            Cuéntanos sobre tu organización para conectar con talento diverso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          {/* Grid de campos - todo en una vista */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Razón Social */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Razón Social *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="text"
                  value={formData.razonSocial}
                  onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="Ej. Tech Inclusiva SAC"
                  required
                />
              </div>
            </div>

            {/* RUC */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">RUC *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="text"
                  value={formData.ruc}
                  onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="20123456789"
                  maxLength={11}
                  required
                />
              </div>
            </div>

            {/* Sector */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Sector *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73] pointer-events-none" />
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all appearance-none outline-none text-sm"
                  required
                >
                  <option value="" disabled>Seleccionar sector...</option>
                  {SECTORES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tamaño */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Tamaño de empresa *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73] pointer-events-none" />
                <select
                  value={formData.tamaño}
                  onChange={(e) => setFormData({ ...formData, tamaño: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all appearance-none outline-none text-sm"
                  required
                >
                  <option value="" disabled>Seleccionar tamaño...</option>
                  {TAMAÑOS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ciudad - full width */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Ciudad / Ubicación principal *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="Ej. Lima, Arequipa, Trujillo..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer action */}
          <div className="flex items-center justify-between pt-4 shrink-0">
            <p className="text-[#3d4943] text-sm italic">
              Los datos serán verificados por nuestro equipo.
            </p>
            <button
              type="submit"
              disabled={!formData.razonSocial.trim() || !formData.ruc.trim() || !formData.sector || !formData.tamaño || !formData.ciudad.trim()}
              className={`
                font-bold text-lg px-10 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg
                ${formData.razonSocial.trim() && formData.ruc.trim() && formData.sector && formData.tamaño && formData.ciudad.trim()
                  ? 'bg-[#fd7549] text-white hover:opacity-90 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Siguiente
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Step1Empresa;