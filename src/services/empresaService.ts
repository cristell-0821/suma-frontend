import api from "../lib/axios";

export const empresaService = {
  // Obtener mi perfil
  getProfile: async () => {
    const response = await api.get('/empresas/perfil');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data: any) => {
    const response = await api.put('/empresas/perfil', data);
    return response.data;
  },

  // Crear oferta de trabajo
  createJobOffer: async (data: {
    titulo: string;
    descripcion: string;
    requisitos: string[];
    funciones: string[];
    modalidad: string;
    sector: string;
    ciudad: string;
    salarioMin?: number;
    salarioMax?: number;
    disabilityIds: string[];
  }) => {
    const response = await api.post('/job-offers', data);
    return response.data;
  },

  // Ver mis ofertas
  getMyJobOffers: async () => {
    const response = await api.get('/job-offers/empresa/mis-ofertas');
    return response.data;
  },

  // Ver postulantes a mis ofertas
  getApplicants: async () => {
    const response = await api.get('/applications/empresa/postulantes');
    return response.data;
  },

  // Cambiar estado de postulación
  updateApplicationStatus: async (applicationId: string, status: string) => {
    const response = await api.put(`/applications/${applicationId}/estado`, { status });
    return response.data;
  },
};