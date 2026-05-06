import api from '../lib/axios';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Todas las empresas
  getAllCompanies: async () => {
    const response = await api.get('/admin/empresas');
    return response.data;
  },

  // Empresas pendientes (mantener)
  getPendingCompanies: async () => {
    const response = await api.get('/admin/empresas/pendientes');
    return response.data;
  },

  // Toggle verificación
  verifyCompany: async (empresaId: string) => {
    const response = await api.post(`/admin/empresas/${empresaId}/verificar`);
    return response.data;
  },

  // Toggle deshabilitar/habilitar
  toggleCompanyStatus: async (empresaId: string) => {
    const response = await api.patch(`/admin/empresas/${empresaId}/estado`);
    return response.data;
  },
};