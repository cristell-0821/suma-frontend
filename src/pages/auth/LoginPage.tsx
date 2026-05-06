import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Iniciando login...');
      const response = await authService.login({ email, password });
      console.log('✅ Login exitoso:', response.user.role);
      
      setAuth(response.user, response.accessToken, response.refreshToken);
      
      switch (response.user.role) {
        case 'POSTULANTE':
          navigate('/postulante');
          break;
        // ... etc
      }
      switch (response.user.role) {
        case 'POSTULANTE':
          navigate('/postulante/empleos');
          break;
        case 'EMPRESA':
          navigate('/empresa/perfil');
          break;
        case 'SUPERADMIN':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
      console.log('✅ Navegación llamada');
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    navigate('/registro');
  };

  return (
    <div className="min-h-screen bg-[#FAEEDA] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-[#FAEEDA]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-[#4A1B0C] font-['Plus_Jakarta_Sans'] tracking-tight">
            Suma
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm font-medium text-[#4A1B0C]/70 italic">
            Súmate al trabajo inclusivo
          </span>
        </div>
        <div className="flex items-center">
          <button className="text-[#1D9E75] hover:bg-[#fef2de] transition-colors p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-[0px_20px_40px_rgba(74,27,12,0.06)]">
          
          {/* Visual Side (Editorial Branding) */}
          <div className="hidden md:flex md:w-1/2 relative bg-[#1D9E75] p-12 flex-col justify-between overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#86f8c9] blur-3xl"></div>
              <div className="absolute bottom-12 right-12 w-96 h-96 rounded-full bg-[#fd7549] blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-white text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight tracking-tight mb-6">
                Talento sin etiquetas,<br />oportunidades sin barreras.
              </h2>
              <p className="text-[#86f8c9] text-lg max-w-sm">
                Conectamos el potencial humano con empresas que valoran la diversidad y la inclusión real.
              </p>
            </div>

            {/* Testimonial Card */}
            <div className="relative z-10 mt-auto bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D85A30] flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    "Suma me ayudó a encontrar un entorno donde mi capacidad es lo primero."
                  </p>
                  <p className="text-[#86f8c9] text-xs mt-1">— Ana Martínez, Desarrolladora</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Side */}
          <LoginForm
            onSubmit={handleSubmit}
            onGoToRegister={goToRegister}
            loading={loading}
            error={error}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-10 pt-4 px-6 text-center">
        <div className="max-w-md mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a className="text-xs text-[#4A1B0C]/50 hover:text-[#1D9E75] transition-colors" href="#">
            Términos de Servicio
          </a>
          <a className="text-xs text-[#4A1B0C]/50 hover:text-[#1D9E75] transition-colors" href="#">
            Política de Privacidad
          </a>
          <a className="text-xs text-[#4A1B0C]/50 hover:text-[#1D9E75] transition-colors" href="#">
            Accesibilidad
          </a>
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-widest text-[#4A1B0C]/30 font-bold">
          © 2024 Suma - Inclusión que Transforma
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;