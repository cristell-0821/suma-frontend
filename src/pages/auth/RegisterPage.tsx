import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as 'POSTULANTE' | 'EMPRESA' | '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData as any);
      
      setAuth(response.user, response.accessToken, response.refreshToken);
      
      // Redirigir según el rol
      switch (response.user.role) {
        case 'POSTULANTE':
          navigate('/postulante');
          break;
        case 'EMPRESA':
          navigate('/empresa');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (role: 'POSTULANTE' | 'EMPRESA') => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4 py-8">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-brown-500 mb-2 text-center">
          Crear cuenta en Suma
        </h1>
        <p className="text-center text-brown-400 mb-6">
          Súmate al trabajo inclusivo
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          // Paso 1: Seleccionar rol
          <div className="space-y-4">
            <p className="text-center text-brown-500 font-medium mb-4">
              ¿Cómo quieres usar Suma?
            </p>
            
            <button
              onClick={() => selectRole('POSTULANTE')}
              className="w-full p-6 border-2 border-cream-200 rounded-xl hover:border-coral-500 hover:bg-coral-50 transition-all text-left"
            >
              <h3 className="text-lg font-semibold text-brown-500 mb-2">
                Busco empleo
              </h3>
              <p className="text-sm text-brown-400">
                Soy una persona con discapacidad buscando oportunidades laborales inclusivas
              </p>
            </button>

            <button
              onClick={() => selectRole('EMPRESA')}
              className="w-full p-6 border-2 border-cream-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all text-left"
            >
              <h3 className="text-lg font-semibold text-brown-500 mb-2">
                Soy empresa
              </h3>
              <p className="text-sm text-brown-400">
                Quiero publicar ofertas de trabajo y contratar talento diverso
              </p>
            </button>
          </div>
        ) : (
          // Paso 2: Formulario de datos
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-brown-400 hover:text-brown-500 text-sm"
              >
                ← Volver
              </button>
              <span className="text-sm text-brown-400">
                {formData.role === 'POSTULANTE' ? 'Postulante' : 'Empresa'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-500 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-500 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-500 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field"
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-brown-400">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-coral-500 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;