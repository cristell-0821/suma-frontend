import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import AppRouter from './router/AppRouter';

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Solo valida si el store dice que está logueado
    if (isAuthenticated) {
      checkAuth();
    }
  }, []);

  return <AppRouter />;
}

export default App;