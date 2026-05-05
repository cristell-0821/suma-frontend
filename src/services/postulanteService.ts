import api from '../lib/axios';
//import type { ProfileFormData } from '../components/postulante/perfil/ProfileEditModal';
import type { ProfileUpdatePayload } from '../components/postulante/perfil/ProfileEditModal';

export const postulanteService = {
  // Obtener mi perfil
  getProfile: async () => {
    const response = await api.get('/postulantes/perfil');
    return response.data;
  },

  // Actualizar perfil
   async updateProfile(formData: ProfileUpdatePayload) {
    const { data } = await api.put('/postulantes/perfil', formData);
    return data;
  },

  // Ver ofertas de trabajo (con filtros mejorados)
  getJobOffers: async (filters?: {
    search?: string;
    location?: string;
    modality?: string | string[];
    sectorId?: string;
    ciudadId?: string;
    departamentoId?: string;  // ← NUEVO
    disabilityIds?: string[];
  }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.modality) {
      if (Array.isArray(filters.modality)) {
        filters.modality.forEach((m) => params.append('modality', m));
      } else {
        params.append('modality', filters.modality);
      }
    }
    if (filters?.sectorId) params.append('sectorId', filters.sectorId);
    if (filters?.ciudadId) params.append('ciudadId', filters.ciudadId);
    if (filters?.departamentoId) params.append('departamentoId', filters.departamentoId);  // ← NUEVO
    if (filters?.disabilityIds) {
      filters.disabilityIds.forEach((id) => params.append('disabilityId', id));
    }

    const response = await api.get(`/postulantes/ofertas?${params.toString()}`);
    return response.data;
  },

  // Ver UNA oferta por ID
  getJobOfferById: async (id: string) => {
    const response = await api.get(`/job-offers/${id}`);
    return response.data;
  },

  // Ver mis postulaciones
  getMyApplications: async () => {
    const response = await api.get('/applications/mis-postulaciones');
    return response.data;
  },

  // Aplicar a una oferta
  applyToJob: async (jobOfferId: string, mensaje?: string) => {
    const response = await api.post('/applications', {
      jobOfferId,
      mensaje,
    });
    return response.data;
  },
  updateProfilePhoto: async (fotoPerfil: string | null) => {
    const { data } = await api.patch('/postulantes/perfil/foto', { fotoPerfil });
    return data;
  },
};