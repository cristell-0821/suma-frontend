import api from '../lib/axios';

export const adminService = {
  // Dashboard con estadísticas
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Empresas pendientes
  getPendingCompanies: async () => {
    const response = await api.get('/admin/empresas/pendientes');
    return response.data;
  },

  // Aprobar empresa
  approveCompany: async (empresaId: string) => {
    const response = await api.post(`/admin/empresas/${empresaId}/aprobar`);
    return response.data;
  },

  // Verificar empresa (badge "Empresa Inclusiva Verificada")
  verifyCompany: async (empresaId: string) => {
    const response = await api.post(`/admin/empresas/${empresaId}/verificar`);
    return response.data;
  },
};