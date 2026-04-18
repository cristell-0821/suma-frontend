import api from '../lib/axios';

export const postulanteService = {
  // Obtener mi perfil
  getProfile: async () => {
    const response = await api.get('/postulantes/perfil');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data: any) => {
    const response = await api.put('/postulantes/perfil', data);
    return response.data;
  },

  // Ver ofertas de trabajo
  getJobOffers: async (filters?: {
    modality?: string;
    sector?: string;
    city?: string;
    disabilityId?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.modality) params.append('modality', filters.modality);
    if (filters?.sector) params.append('sector', filters.sector);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.disabilityId) params.append('disabilityId', filters.disabilityId);
    
    const response = await api.get(`/postulantes/ofertas?${params.toString()}`);
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
};