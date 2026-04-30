import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export type UserRole = 'POSTULANTE' | 'EMPRESA' | 'SUPERADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fotoPerfil?: string;  // ← NUEVO
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
  updateUserPhoto: (fotoPerfil: string | undefined) => void; 
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
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

      // ← AQUÍ VA: justo después de setHasHydrated, antes del cierre del objeto
      updateUserPhoto: (fotoPerfil) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, fotoPerfil } });
        }
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
        if (state) {
          state.setHasHydrated(true);
        } else {
          useAuthStore.getState().setHasHydrated(true);
        }
      },
    }
  )
);