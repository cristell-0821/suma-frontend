import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { ReactNode } from 'react';

// Páginas públicas
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Páginas protegidas
import PostulanteDashboard from '../pages/postulante/PostulanteDashboard';
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
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        
        {/* Postulante */}
        <Route 
          path="/postulante/*" 
          element={
            <ProtectedRoute allowedRoles={['POSTULANTE']}>
              <PostulanteDashboard />
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
        
        {/* Redirect por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;