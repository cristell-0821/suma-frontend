import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { ReactNode } from 'react';

// Páginas públicas
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/public/HomePage';

// Páginas postulante
import EmpleosPage from '../pages/postulante/EmpleosPage';
// import PostulacionesPage from '../pages/postulante/PostulacionesPage';
// import PerfilPage from '../pages/postulante/PerfilPage';
import DetalleEmpleoPage from '../pages/postulante/DetalleEmpleoPage';

import EmpresaDashboard from '../pages/empresa/EmpresaDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Componente para proteger rutas
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: ReactNode; 
  allowedRoles: string[] 
}) => {
  const { user, logout } = useAuthStore();
  const token = localStorage.getItem('accessToken');
  
  if (!token || !user) {
    logout();
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const RoleRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role === 'POSTULANTE') return <Navigate to="/postulante" replace />;
  if (user?.role === 'EMPRESA') return <Navigate to="/empresa" replace />;
  if (user?.role === 'SUPERADMIN') return <Navigate to="/admin" replace />;
  
  return <Navigate to="/" replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing - accesible para todos */}
        <Route path="/" element={<HomePage />} />
        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        
        {/* Postulante */}
        <Route 
          path="/postulante/*" 
          element={
            <ProtectedRoute allowedRoles={['POSTULANTE']}>
              <EmpleosPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/postulante/empleos/:id"
          element={
            <ProtectedRoute allowedRoles={['POSTULANTE']}>
              <DetalleEmpleoPage />
            </ProtectedRoute>
          }
        />
        
        {/* Empresa */}
        <Route 
          path="/empresa/*" 
          element={
            <ProtectedRoute allowedRoles={['EMPRESA']}>
              <EmpresaDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirect inteligente */}
        <Route path="/dashboard" element={<RoleRedirect />} />
        
        {/* Redirect por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;