import api from "../lib/axios";

export interface EmpresaProfile {
  id: string;
  userId: string;
  razonSocial?: string;
  ruc?: string;
  sectorId?: string;
  sector?: { id: string; nombre: string };
  tamaño?: string;
  descripcion?: string;
  sitioWeb?: string;
  ciudadId?: string;
  ciudad?: { id: string; nombre: string; departamento?: { id: string; nombre: string } };  // ← relación
  direccion?: string;
  nombreContacto?: string;
  cargoContacto?: string;
  telefonoContacto?: string;
  logoUrl?: string;
  portadaUrl?: string;
  isApproved: boolean;
  isVerified: boolean;
  accommodations: string[];
  jobOffersCount?: number;
  user: {
    email: string;
    createdAt: string;
  };
}

export interface UpdateEmpresaPayload {
  razonSocial?: string;
  ruc?: string;
  sectorId?: string;
  tamaño?: string;
  descripcion?: string;
  sitioWeb?: string;
  ciudadId?: string;
  direccion?: string;
  nombreContacto?: string;
  cargoContacto?: string;
  telefonoContacto?: string;
  accommodations?: string[];
  logoUrl?: string;
  portadaUrl?: string;
}

export interface JobOfferPayload {
  titulo: string;
  descripcion: string;
  requisitos: string[];
  funciones: string[];
  modalidad: string;
  sectorId: string;
  ciudadId: string;
  salarioMin?: number;
  salarioMax?: number;
  expiresAt?: string;
  disabilityIds: string[];
}

export const empresaService = {
  // Obtener mi perfil
  getProfile: async () => {
    const response = await api.get('/empresas/perfil');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data: UpdateEmpresaPayload) => {
    const response = await api.put('/empresas/perfil', data);
    return response.data;
  },

  // Crear oferta de trabajo
  createJobOffer: async (data: JobOfferPayload) => {
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

  updateJobOffer: async (offerId: string, data: Partial<JobOfferPayload> & { isActive?: boolean }) => {
    const response = await api.put(`/job-offers/${offerId}`, data);
    return response.data;
  },

  // ← NUEVO: Eliminar oferta
  deleteJobOffer: async (offerId: string) => {
    const response = await api.delete(`/job-offers/${offerId}`);
    return response.data;
  },

  toggleJobOffer: async (offerId: string) => {
    const response = await api.patch(`/job-offers/${offerId}/toggle`);
    return response.data;
  },
};