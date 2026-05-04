// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

// Páginas públicas
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/public/HomePage';

// Páginas postulante
import EmpleosPage from '../pages/postulante/EmpleosPage';
import PostulacionesPage from '../pages/postulante/PostulacionesPage';
import PerfilPage from '../pages/postulante/PerfilPage';
import DetalleEmpleoPage from '../pages/postulante/DetalleEmpleoPage';

// Páginas empresa (NUEVAS)
import EmpresaPerfilPage from '../pages/empresa/EmpresaPerfilPage';
import VacantesPage from '../pages/empresa/VacantesPage';
import PostulantesPage from '../pages/empresa/PostulantesPage';

import AdminDashboard from '../pages/admin/AdminDashboard';

// ============================================
// COMPONENTE DE CARGA
// ============================================
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-[#FAEEDA]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal" />
  </div>
);

// ============================================
// AUTH LOADER
// ============================================
const AuthLoader = ({ children }: { children: ReactNode }) => {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (hasChecked.current) return;

    hasChecked.current = true;

    // Solo llama checkAuth si hay token guardado (para validar que sigue vigente)
    if (accessToken) {
      checkAuth();
    }
    // Si no hay token, no hay nada que verificar — ya está isAuthenticated: false
  }, [hasHydrated]); // ← solo depende de hasHydrated, sin checkAuth ni accessToken

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

// ============================================
// PROTECTED ROUTE
// ============================================
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: ReactNode; 
  allowedRoles: string[] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated || !user) {
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
      <AuthLoader>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          
          {/*  POSTULANTE */}
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
          <Route
            path="/postulante/postulaciones"
            element={
              <ProtectedRoute allowedRoles={['POSTULANTE']}>
                <PostulacionesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/postulante/perfil"
            element={
              <ProtectedRoute allowedRoles={['POSTULANTE']}>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
          
          {/* Empresa — RUTAS NUEVAS */}
          <Route 
            path="/empresa/perfil" 
            element={
              <ProtectedRoute allowedRoles={['EMPRESA']}>
                <EmpresaPerfilPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/empresa/vacantes" 
            element={
              <ProtectedRoute allowedRoles={['EMPRESA']}>
                <VacantesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/empresa/postulantes" 
            element={
              <ProtectedRoute allowedRoles={['EMPRESA']}>
                <PostulantesPage />
              </ProtectedRoute>
            } 
          />
          {/* Redirect /empresa → /empresa/perfil */}
          <Route 
            path="/empresa" 
            element={
              <ProtectedRoute allowedRoles={['EMPRESA']}>
                <Navigate to="/empresa/perfil" replace />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="/dashboard" element={<RoleRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthLoader>
    </BrowserRouter>
  );
};

export default AppRouter;