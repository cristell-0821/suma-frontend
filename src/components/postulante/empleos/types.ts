export interface Disability {
  id: string;
  nombre: string;
}

export interface Empresa {
  id: string;
  razonSocial: string;
  ruc?: string;  
  isVerified: boolean;
  logo?: string;
}

export interface JobOffer {
  id: string;
  titulo: string;
  descripcion: string;
  funciones?: string | string[];  
  requisitos?: string | string[];
  empresa: Empresa;
  modalidad: 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL';
  tipoJornada: string;
  sector?: string;
  ciudad: string;
  salarioMin?: number;
  salarioMax?: number;
  disabilities: Disability[];
  accesibilidadFeatures: string[];
  createdAt: string;
  isRecommended?: boolean;
}

export interface JobOfferDetail extends JobOffer {
  requisitos: string;
  funciones: string;
  beneficios?: string[];
  fechaLimite?: string;
}

export interface Application {
  id: string;
  status: 'ENVIADO' | 'EN_REVISION' | 'ENTREVISTA' | 'CONTRATADO' | 'RECHAZADO';
  createdAt: string;
  mensaje?: string;
  jobOffer: {
    id: string;
    titulo: string;
    empresa: {
      razonSocial: string;
      logo?: string;
    };
    modalidad: string;
    ciudad: string;
  };
}

export interface PostulanteProfile {
  id: string;
  nombres: string;
  apellidos: string;
  telefono?: string;
  ciudad?: string;
  modalidadPreferida?: string;
  sectorPreferido?: string; 
  ciudadPreferida?: string;
  sobreMi?: string;
  skills?: string[];
  cvUrl?: string;
  salarioEsperado?: number;
  linkedin?: string;
  portfolio?: string;
  fotoPerfil?: string; 
  fechaNacimiento?: string;
  sectorInteres?: string[];
  user: {
    id: string;
    email: string;
  };
  disabilities: Disability[];
}