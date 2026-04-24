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