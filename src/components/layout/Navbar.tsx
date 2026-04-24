import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleDashboard = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'POSTULANTE') {
      navigate('/postulante');
    } else if (user?.role === 'EMPRESA') {
      navigate('/empresa');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-cream-100 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-cream-100">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <button 
          onClick={handleLogoClick}
          className="text-2xl font-black text-teal tracking-tight font-sans hover:opacity-80 transition-opacity"
        >
          Suma
        </button>

        {/* Links - solo para guest en landing */}
        {!isAuthenticated && (
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="font-sans font-medium text-base text-teal border-b-2 border-teal pb-1">
              Inicio
            </a>
            <a href="#empleos" className="font-sans font-medium text-base text-brown hover:text-coral transition-colors">
              Empleos
            </a>
            <a href="#como-funciona" className="font-sans font-medium text-base text-brown hover:text-coral transition-colors">
              Cómo funciona
            </a>
          </div>
        )}

        {/* Acciones derecha */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-brown font-medium">
                {user?.email}
              </span>
              <button
                onClick={handleDashboard}
                className="bg-teal text-white px-6 py-2.5 rounded-xl font-sans font-bold text-sm hover:bg-teal-600 active:scale-95 transition-all"
              >
                Mi Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-brown hover:text-coral font-medium text-sm transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              onClick={handleDashboard}
              className="bg-teal text-white px-6 py-2.5 rounded-xl font-sans font-bold text-sm hover:bg-teal-600 active:scale-95 transition-all"
            >
              Show My Potential
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;