import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, User,FileText, Users, Search } from 'lucide-react';
import { useEffect } from 'react';

interface NavItem {
  label: string;
  path: string;
}

const postulanteNav: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Empleos', path: '/postulante/empleos' },
  { label: 'Mi Perfil', path: '/postulante/perfil' },
];

const empresaNav: NavItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Vacantes', path: '/empresa/vacantes' },
  { label: 'Mi Empresa', path: '/empresa/perfil' },
];

const DashboardNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token && user) {
      logout();
      navigate('/login');
    }
  }, [token, user, logout, navigate]);

  const navItems = user?.role === 'POSTULANTE' ? postulanteNav : empresaNav;
  const isPostulante = user?.role === 'POSTULANTE';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-cream-50/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-cream-100">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">

        {/* IZQUIERDA */}
        <button onClick={() => navigate('/')} className="shrink-0">
          <img
            src="/img/logo.png"
            alt="Suma"
            className="h-10 w-auto object-contain"
          />
        </button>
        <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`font-sans font-medium text-base transition-colors ${
                  isActive(item.path)
                    ? 'text-teal border-b-2 border-teal pb-1'
                    : 'text-brown hover:text-teal'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

        {/* DERECHA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigate(
                isPostulante
                  ? '/postulante/empleos'
                  : '/empresa/vacantes'
              )
            }
            className="p-2 rounded-full hover:bg-cream-100 transition"
          >
            <Search className="w-5 h-5 text-teal" />
          </button>

          <div className="relative group">
            <button className="w-10 h-10 rounded-full border-2 border-teal bg-teal-50 flex items-center justify-center text-teal font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-cream-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="px-4 py-3 border-b border-cream-100">
                <p className="text-sm font-medium text-brown truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => navigate(isPostulante ? '/postulante/perfil' : '/empresa/perfil')}
                className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors"
              >
                <User className="w-4 h-4"/>
                Mi Perfil
              </button>
              <button
                onClick={() => navigate(isPostulante ? '/postulante/postulaciones' : '/empresa/postulantes')}
                className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors"
              >
                <span className="material-symbols-outlined text-base align-text-bottom mr-2">
                  {isPostulante ? (
                    <FileText className="w-4 h-4 mr-2" />
                  ) : (
                    <Users className="w-4 h-4 mr-2" />
                  )}
                </span>
                {isPostulante ? 'Mis Postulaciones' : 'Postulantes'}
              </button>
              <div className="border-t border-cream-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-coral hover:text-coral-600 hover:bg-coral-50 transition-colors rounded-b-xl"
                >
                  <LogOut className="w-4 h-4"/>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNav;