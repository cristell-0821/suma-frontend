import api from '../lib/axios';

export const disabilitiesService = {
  getAll: async () => {
    const response = await api.get('/disabilities');
    return response.data;
  },
};