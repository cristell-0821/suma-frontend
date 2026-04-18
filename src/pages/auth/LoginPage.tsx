import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      setAuth(response.user, response.accessToken, response.refreshToken);
      
      // Redirigir según el rol
      switch (response.user.role) {
        case 'POSTULANTE':
          navigate('/postulante');
          break;
        case 'EMPRESA':
          navigate('/empresa');
          break;
        case 'SUPERADMIN':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-brown-500 mb-2 text-center">
          Iniciar sesión en Suma
        </h1>
        <p className="text-center text-brown-400 mb-6">
          Súmate al trabajo inclusivo
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center mt-6 text-brown-400">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-coral-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;