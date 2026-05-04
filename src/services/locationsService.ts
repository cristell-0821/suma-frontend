import api from "../lib/axios";

export interface Departamento {
  id: string;
  nombre: string;
  ciudades: {
    id: string;
    nombre: string;
  }[];
}

export interface Ciudad {
  id: string;
  nombre: string;
  departamentoId: string;
}

export const locationsService = {
  getDepartamentos: async (): Promise<Departamento[]> => {
    const response = await api.get('/locations/departamentos');
    return response.data;
  },

  getDepartamento: async (id: string): Promise<Departamento> => {
    const response = await api.get(`/locations/departamentos/${id}`);
    return response.data;
  },

  getCiudadesByDepartamento: async (departamentoId: string): Promise<Ciudad[]> => {
    const response = await api.get(`/locations/departamentos/${departamentoId}/ciudades`);
    return response.data;
  },
};