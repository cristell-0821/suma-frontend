import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Smartphone, MapPin, Eye, EyeOff } from 'lucide-react';

interface Step2PostulanteProps {
  onSubmit: (data: {
    email: string;
    password: string;
    telefono: string;
    departamento: string;
  }) => void;
  onBack: () => void;
}

const DEPARTAMENTOS_PERU = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
  'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
  'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
  'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
  'Tumbes', 'Ucayali'
];

const Step2Postulante = ({ onSubmit, onBack }: Step2PostulanteProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    telefono: '',
    departamento: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.telefono || !formData.departamento) {
      return;
    }
    setLoading(true);
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] text-[#201b0f] pb-32 relative">
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

      <main className="max-w-4xl mx-auto px-6 pt-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[#a8380f] font-bold text-sm tracking-widest uppercase font-['Plus_Jakarta_Sans']">
                Paso 2 de 2
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#201b0f] mt-2 tracking-tight">
                Casi listo
              </h2>
              <p className="text-[#3d4943] text-lg mt-2 font-['Be_Vietnam_Pro']">
                Configura tus credenciales y ubicación
              </p>
            </div>
            <div className="hidden md:block text-right">
              <span className="text-[#00694c] font-bold text-2xl font-['Plus_Jakarta_Sans']">100%</span>
            </div>
          </div>
          <div className="h-4 w-full bg-[#f8ecd8] rounded-full overflow-hidden">
            <div className="h-full w-full bg-[#00694c] rounded-full transition-all duration-700"></div>
          </div>
        </div>

        {/* Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form */}
          <section className="lg:col-span-7 bg-white rounded-lg p-8 md:p-12 shadow-[0px_20px_40px_rgba(32,27,15,0.06)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00694c]"></div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email */}
              <div className="group">
                <label className="block font-['Plus_Jakarta_Sans'] font-semibold text-[#201b0f] mb-3 text-sm">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a73]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-[#fef2de] border-none rounded-xl focus:ring-2 focus:ring-[#00694c] transition-all text-[#201b0f] placeholder:text-[#6d7a73]/50 outline-none"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block font-['Plus_Jakarta_Sans'] font-semibold text-[#201b0f] mb-3 text-sm">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a73]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-[#fef2de] border-none rounded-xl focus:ring-2 focus:ring-[#00694c] transition-all text-[#201b0f] outline-none"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d7a73] hover:text-[#00694c] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phone & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block font-['Plus_Jakarta_Sans'] font-semibold text-[#201b0f] mb-3 text-sm">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a73]" />
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[#fef2de] border-none rounded-xl focus:ring-2 focus:ring-[#00694c] transition-all text-[#201b0f] placeholder:text-[#6d7a73]/50 outline-none"
                      placeholder="+51 900 000 000"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block font-['Plus_Jakarta_Sans'] font-semibold text-[#201b0f] mb-3 text-sm">
                    Departamento
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a73] pointer-events-none" />
                    <select
                      value={formData.departamento}
                      onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-[#fef2de] border-none rounded-xl focus:ring-2 focus:ring-[#00694c] transition-all text-[#201b0f] appearance-none outline-none"
                      required
                    >
                      <option value="" disabled>Seleccionar...</option>
                      {DEPARTAMENTOS_PERU.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !formData.email || !formData.password || !formData.telefono || !formData.departamento}
                className={`
                  w-full py-5 font-['Plus_Jakarta_Sans'] font-bold text-lg rounded-xl transition-all mt-4
                  ${!loading && formData.email && formData.password && formData.telefono && formData.departamento
                    ? 'bg-[#fd7549] text-white hover:opacity-90 active:scale-[0.98] shadow-lg shadow-[#fd7549]/20'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {loading ? 'Registrando...' : 'Finalizar registro'}
              </button>
            </form>
          </section>

          {/* Right: Editorial */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-[#f8ecd8] rounded-lg p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-0 rounded-full bg-[#c74d24]/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#c74d24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#201b0f] mb-3">
                  Tu privacidad es nuestra prioridad
                </h3>
                <p className="text-[#3d4943] leading-relaxed">
                  Protegemos tus datos con los más altos estándares. Tu información de contacto solo será visible para empresas verificadas a las que postules.
                </p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden h-52 md:h-56 relative shadow-lg group">

              {/* Imagen */}
              <img
                src="/img/step2.png"
                alt="Personas trabajando en equipo"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#00694c]/60 to-transparent z-10"></div>

              {/* Texto */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <p className="text-white font-['Plus_Jakarta_Sans'] font-medium text-lg leading-snug">
                  Únete a la red de talento más grande del país.
                </p>
              </div>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Step2Postulante;