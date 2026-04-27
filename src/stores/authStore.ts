import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export type UserRole = 'POSTULANTE' | 'EMPRESA' | 'SUPERADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,    // ← CAMBIO: empieza en false, AuthLoader lo maneja
      hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        const token = get().accessToken;

        if (!token) {
          set({ isLoading: false, isAuthenticated: false, user: null });
          return false;
        }

        set({ isLoading: true });

        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const { user: userData } = response.data;

          set({
            user: {
              id: userData.userId,
              email: userData.email,
              role: userData.role,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
        }
      },

      setHasHydrated: (value: boolean) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: 'suma-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // state puede ser undefined si el storage estaba vacío
        if (state) {
          state.setHasHydrated(true);
        } else {
          // ← CRÍTICO: si no hay nada en storage, igual hay que hidratar
          useAuthStore.getState().setHasHydrated(true);
        }
      },
    }
  )
);