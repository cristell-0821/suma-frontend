import { useState } from 'react';
import { ArrowRight, ArrowLeft, Briefcase, Building2 } from 'lucide-react';

interface StepRoleSelectionProps {
  onSelectRole: (role: 'POSTULANTE' | 'EMPRESA') => void;
  onGoToLogin: () => void;
}

const StepRoleSelection = ({ onSelectRole, onGoToLogin }: StepRoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<'POSTULANTE' | 'EMPRESA' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAEEDA] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-[#FAEEDA]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onGoToLogin}
            className="text-[#1D9E75] hover:bg-[#fef2de] transition-colors p-2 rounded-full active:scale-95 duration-150"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-[#4A1B0C] tracking-tight font-['Plus_Jakarta_Sans']">
              Suma
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-[#4A1B0C]/70 text-sm font-medium">
            Súmate al trabajo inclusivo
          </span>
          <button 
            onClick={onGoToLogin}
            className="text-[#1D9E75] font-bold text-sm hover:underline"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-12 px-6 flex flex-col items-center max-w-4xl mx-auto w-full">
        {/* Hero Heading */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4A1B0C] tracking-tight font-['Plus_Jakarta_Sans']">
            ¿Cómo quieres usar Suma?
          </h1>
          <p className="text-lg md:text-xl text-[#4A1B0C]/80 max-w-xl mx-auto">
            Elige la opción que mejor te describa para empezar tu camino hacia una inclusión real.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          {/* Postulante Card */}
          <label 
            className="group cursor-pointer relative"
            onClick={() => setSelectedRole('POSTULANTE')}
          >
            <input 
              type="radio" 
              name="user_type" 
              className="peer hidden"
              checked={selectedRole === 'POSTULANTE'}
              onChange={() => setSelectedRole('POSTULANTE')}
            />
            <div className={`
              h-full rounded-2xl p-8 transition-all duration-300 
              flex flex-col items-center text-center space-y-6
              border-2 border-[#D85A30] bg-[rgba(216,90,48,0.04)]
              peer-checked:shadow-xl peer-checked:-translate-y-2
              hover:shadow-lg hover:-translate-y-1
            `}>
              <div className="w-20 h-20 rounded-full bg-[#D85A30]/10 flex items-center justify-center text-[#D85A30]">
                <Briefcase className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#4A1B0C] mb-3 font-['Plus_Jakarta_Sans']">
                  Busco empleo
                </h3>
                <p className="text-[#4A1B0C]/70 leading-relaxed">
                  Soy una persona con discapacidad buscando oportunidades laborales inclusivas y herramientas para potenciar mi talento.
                </p>
              </div>
              <div className="mt-auto pt-4">
                <span className={`
                  inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#D85A30] text-white
                  transition-opacity duration-300
                  ${selectedRole === 'POSTULANTE' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </label>

          {/* Empresa Card */}
          <label 
            className="group cursor-pointer relative"
            onClick={() => setSelectedRole('EMPRESA')}
          >
            <input 
              type="radio" 
              name="user_type" 
              className="peer hidden"
              checked={selectedRole === 'EMPRESA'}
              onChange={() => setSelectedRole('EMPRESA')}
            />
            <div className={`
              h-full rounded-2xl p-8 transition-all duration-300 
              flex flex-col items-center text-center space-y-6
              border-2 border-[#1D9E75] bg-[rgba(29,158,117,0.04)]
              peer-checked:shadow-xl peer-checked:-translate-y-2
              hover:shadow-lg hover:-translate-y-1
            `}>
              <div className="w-20 h-20 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75]">
                <Building2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#4A1B0C] mb-3 font-['Plus_Jakarta_Sans']">
                  Soy empresa
                </h3>
                <p className="text-[#4A1B0C]/70 leading-relaxed">
                  Quiero publicar ofertas de trabajo y contratar talento diverso e inclusivo, fortaleciendo nuestra cultura organizacional.
                </p>
              </div>
              <div className="mt-auto pt-4">
                <span className={`
                  inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#1D9E75] text-white
                  transition-opacity duration-300
                  ${selectedRole === 'EMPRESA' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </label>
        </div>

        {/* CTA */}
        <div className="w-full max-w-md mx-auto space-y-6">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`
              w-full py-5 rounded-2xl font-bold text-lg shadow-lg 
              transition-all flex items-center justify-center gap-2
              ${selectedRole 
                ? 'bg-[#D85A30] text-white hover:brightness-110 active:scale-[0.98]' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="md:hidden text-center">
            <button 
              onClick={onGoToLogin}
              className="text-[#1D9E75] font-semibold text-sm hover:underline"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-[#4A1B0C]/50 text-xs font-medium">
        © 2024 Suma. Todos los derechos reservados. <br />
        Hecho con ❤️ por la inclusión laboral.
      </footer>
    </div>
  );
};

export default StepRoleSelection;