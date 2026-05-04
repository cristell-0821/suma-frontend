import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoToRegister: () => void;
  loading: boolean;
  error: string;
}

const LoginForm = ({ onSubmit, onGoToRegister, loading, error }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 bg-white">
      <div className="max-w-md mx-auto">
        {/* Mobile Logo/Tagline */}
        <div className="md:hidden mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[#4A1B0C] font-['Plus_Jakarta_Sans']">
            Suma
          </h1>
          <p className="text-[#4A1B0C]/70 text-sm mt-1">Súmate al trabajo inclusivo</p>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#4A1B0C] font-['Plus_Jakarta_Sans'] mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-[#4A1B0C]/60">
            Ingresa tus credenciales para acceder a tu perfil.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#4A1B0C] ml-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a73]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#f3e7d3] border-none rounded-xl focus:ring-2 focus:ring-[#1D9E75] transition-all text-[#4A1B0C] placeholder:text-[#6d7a73]/60 outline-none"
                placeholder="ejemplo@suma.com"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="block text-sm font-semibold text-[#4A1B0C]">
                Contraseña
              </label>
              <button
                type="button"
                className="text-xs font-medium text-[#a8380f] hover:underline transition-all"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6d7a73]" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-[#f3e7d3] border-none rounded-xl focus:ring-2 focus:ring-[#1D9E75] transition-all text-[#4A1B0C] placeholder:text-[#6d7a73]/60 outline-none"
                placeholder="••••••••"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d7a73] hover:text-[#4A1B0C] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`
              w-full py-4 rounded-xl font-bold text-lg shadow-lg 
              transition-all active:scale-95 duration-150 
              flex items-center justify-center gap-2
              ${!loading && email && password
                ? 'bg-[#D85A30] text-white hover:bg-[#c44d28] hover:shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-10 flex items-center">
          <div className="flex-grow border-t border-[#ede1cd]"></div>
          <span className="mx-4 text-sm text-[#4A1B0C]/40 font-medium">o</span>
          <div className="flex-grow border-t border-[#ede1cd]"></div>
        </div>

        {/* Social Login (placeholders) */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#f8ecd8] rounded-xl border border-transparent hover:border-[#bccac1]/30 transition-all text-sm font-medium text-[#201b0f]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-[#f8ecd8] rounded-xl border border-transparent hover:border-[#bccac1]/30 transition-all text-sm font-medium text-[#201b0f]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-[#4A1B0C]/70">
            ¿No tienes cuenta?
            <button
              onClick={onGoToRegister}
              className="ml-1 text-[#1D9E75] font-bold hover:text-[#008560] transition-colors"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;