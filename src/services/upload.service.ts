import api from '../lib/axios';

export const uploadService = {
  uploadCV: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'cv');

    const response = await api.post('/postulantes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // { url, publicId, type, postulante }
  },

  uploadFotoPerfil: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'foto_perfil');

    const response = await api.post('/postulantes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  uploadLogoEmpresa: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');

    const response = await api.post('/empresas/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  uploadPortadaEmpresa: async (file: File): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portada');

    const response = await api.post('/empresas/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};