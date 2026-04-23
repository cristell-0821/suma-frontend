import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

interface Step2EmpresaProps {
  onSubmit: (data: {
    email: string;
    password: string;
    nombreContacto: string;
    cargoContacto: string;
    telefonoContacto: string;
  }) => void;
  onBack: () => void;
}

const Step2Empresa = ({ onSubmit, onBack }: Step2EmpresaProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombreContacto: '',
    cargoContacto: '',
    telefonoContacto: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.nombreContacto || !formData.telefonoContacto) {
      return;
    }
    onSubmit(formData);
  };

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
          <span className="text-stone-500 font-['Plus_Jakarta_Sans']">Paso 1</span>
          <span className="text-[#a8380f] font-bold font-['Plus_Jakarta_Sans']">Paso 2</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-4 flex flex-col justify-center">
        {/* Progress */}
        <div className="mb-6 shrink-0">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[#a8380f] font-bold text-sm tracking-widest uppercase">
              Progreso del Registro
            </span>
            <span className="text-[#a8380f] font-bold text-2xl">100%</span>
          </div>
          <div className="w-full h-3 bg-[#f3e7d3] rounded-full overflow-hidden">
            <div className="h-full w-full bg-[#00694c] rounded-full transition-all duration-700"></div>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-6 shrink-0">
          <h2 className="text-4xl font-extrabold text-[#00694c] mb-2 leading-tight font-['Plus_Jakarta_Sans']">
            Contacto y acceso
          </h2>
          <p className="text-lg text-[#3d4943]">
            Datos de la persona de contacto y credenciales de acceso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre contacto */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Nombre del contacto *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="text"
                  value={formData.nombreContacto}
                  onChange={(e) => setFormData({ ...formData, nombreContacto: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="Ej. Carlos Rodríguez"
                  required
                />
              </div>
            </div>

            {/* Cargo */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Cargo / Puesto</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="text"
                  value={formData.cargoContacto}
                  onChange={(e) => setFormData({ ...formData, cargoContacto: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="Ej. Gerente de RRHH"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Teléfono de contacto *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="tel"
                  value={formData.telefonoContacto}
                  onChange={(e) => setFormData({ ...formData, telefonoContacto: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="+51 999 888 777"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Correo electrónico *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="empresa@correo.com"
                  required
                />
              </div>
            </div>

            {/* Password - full width */}
            <div className="space-y-1 md:col-span-2">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Contraseña *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium outline-none text-sm"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7a73] hover:text-[#00694c]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 shrink-0">
            <p className="text-[#3d4943] text-sm italic">
              Tu empresa quedará en estado "pendiente de aprobación".
            </p>
            <button
              type="submit"
              disabled={!formData.email || !formData.password || !formData.nombreContacto || !formData.telefonoContacto}
              className={`
                font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-lg
                ${formData.email && formData.password && formData.nombreContacto && formData.telefonoContacto
                  ? 'bg-[#fd7549] text-white hover:opacity-90 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Finalizar registro
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Step2Empresa;