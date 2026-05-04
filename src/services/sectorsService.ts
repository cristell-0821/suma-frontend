import api from "../lib/axios";

export interface Sector {
  id: string;
  nombre: string;
}

export const sectorsService = {
  getAll: async (): Promise<Sector[]> => {
    const response = await api.get('/sectors');
    return response.data;
  },
};