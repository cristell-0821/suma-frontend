import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { postulanteService } from '../services/postulanteService';

export const usePostulanteProfile = () => {
  const user = useAuthStore((s) => s.user);
  const updateUserPhoto = useAuthStore((s) => s.updateUserPhoto);

  useEffect(() => {
    // Solo cargar si es postulante y aún no tenemos foto en el store
    if (user?.role === 'POSTULANTE' && !user.fotoPerfil) {
      postulanteService.getProfile().then((data) => {
        if (data.fotoPerfil) {
          updateUserPhoto(data.fotoPerfil);
        }
      }).catch(() => {
        // Silencioso
      });
    }
  }, [user?.role, user?.fotoPerfil, updateUserPhoto]);
};