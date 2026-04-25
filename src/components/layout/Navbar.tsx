// src/components/layout/Navbar.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Search, LogOut, User, FileText, Users, Briefcase, Building2, Home, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface NavLink {
  label: string;
  path: string;
  icon?: typeof Home;
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const token = localStorage.getItem('accessToken');
  const isLoggedIn = !!token && !!user;

  // Validar token
  useEffect(() => {
    if (!token && user) {
      logout();
      navigate('/login');
    }
  }, [token, user, logout, navigate]);

  // Determinar links según rol y auth
  const getLinks = (): NavLink[] => {
    if (!isLoggedIn) {
      // Guest
      return [
        { label: 'Inicio', path: '/', icon: Home },
        { label: 'Cómo funciona', path: '#como-funciona', icon: Sparkles },
      ];
    }

    if (user?.role === 'POSTULANTE') {
      return [
        { label: 'Inicio', path: '/', icon: Home },
        { label: 'Empleos', path: '/postulante/empleos', icon: Briefcase },
        { label: 'Mis Postulaciones', path: '/postulante/postulaciones', icon: FileText },
        { label: 'Perfil', path: '/postulante/perfil', icon: User },
      ];
    }

    if (user?.role === 'EMPRESA') {
      return [
        { label: 'Inicio', path: '/', icon: Home },
        { label: 'Vacantes', path: '/empresa/vacantes', icon: Briefcase },
        { label: 'Postulantes', path: '/empresa/postulantes', icon: Users },
        { label: 'Empresa', path: '/empresa/perfil', icon: Building2 },
      ];
    }

    return [{ label: 'Inicio', path: '/', icon: Home }];
  };

  const links = getLinks();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isLoggedIn && user?.role === 'POSTULANTE') {
      navigate('/postulante/empleos');
    } else if (isLoggedIn && user?.role === 'EMPRESA') {
      navigate('/empresa');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-cream-50/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-cream-100">
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <button onClick={handleLogoClick} className="shrink-0">
          <img src="/img/logo.png" alt="Suma" className="h-10 w-auto object-contain" />
        </button>

        {/* Links centrales */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  if (item.path.startsWith('#')) {
                    const el = document.querySelector(item.path);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'text-teal bg-teal-50'
                    : 'text-brown/70 hover:text-teal hover:bg-cream-100'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Search icon (solo en dashboard) */}
              {user?.role === 'POSTULANTE' && (
                <button
                  onClick={() => navigate('/postulante/empleos')}
                  className="p-2 rounded-full hover:bg-cream-100 transition"
                  title="Buscar empleos"
                >
                  <Search className="w-5 h-5 text-teal" />
                </button>
              )}
              {user?.role === 'EMPRESA' && (
                <button
                  onClick={() => navigate('/empresa/vacantes')}
                  className="p-2 rounded-full hover:bg-cream-100 transition"
                  title="Buscar vacantes"
                >
                  <Search className="w-5 h-5 text-teal" />
                </button>
              )}

              {/* Avatar + Dropdown */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full border-2 border-teal bg-teal-50 flex items-center justify-center text-teal font-bold text-sm hover:bg-teal-100 transition-colors">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-cream-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                  {/* Email header */}
                  <div className="px-4 py-3 border-b border-cream-100 mb-1">
                    <p className="text-sm font-medium text-brown truncate">{user?.email}</p>
                    <p className="text-xs text-brown/50 capitalize">{user?.role?.toLowerCase()}</p>
                  </div>

                  {/* Links del dropdown */}
                  {user?.role === 'POSTULANTE' && (
                    <>
                      <button
                        onClick={() => navigate('/postulante/empleos')}
                        className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors flex items-center gap-3"
                      >
                        <Briefcase className="w-4 h-4" /> Empleos
                      </button>
                      <button
                        onClick={() => navigate('/postulante/postulaciones')}
                        className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors flex items-center gap-3"
                      >
                        <FileText className="w-4 h-4" /> Mis Postulaciones
                      </button>
                      <button
                        onClick={() => navigate('/postulante/perfil')}
                        className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors flex items-center gap-3"
                      >
                        <User className="w-4 h-4" /> Mi Perfil
                      </button>
                    </>
                  )}

                  {user?.role === 'EMPRESA' && (
                    <>
                      <button
                        onClick={() => navigate('/empresa/vacantes')}
                        className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors flex items-center gap-3"
                      >
                        <Briefcase className="w-4 h-4" /> Mis Vacantes
                      </button>
                      <button
                        onClick={() => navigate('/empresa/postulantes')}
                        className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors flex items-center gap-3"
                      >
                        <Users className="w-4 h-4" /> Postulantes
                      </button>
                      <button
                        onClick={() => navigate('/empresa/perfil')}
                        className="w-full text-left px-4 py-2.5 text-sm text-brown/70 hover:text-teal hover:bg-cream-50 transition-colors flex items-center gap-3"
                      >
                        <Building2 className="w-4 h-4" /> Mi Empresa
                      </button>
                    </>
                  )}

                  {/* Logout */}
                  <div className="border-t border-cream-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-coral hover:text-coral-600 hover:bg-coral-50 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-brown font-medium text-sm hover:text-teal transition-colors px-3 py-2"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate('/registro?role=postulante')}
                className="bg-teal text-white px-5 py-2.5 rounded-xl font-sans font-bold text-sm hover:bg-teal-600 active:scale-95 transition-all"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;