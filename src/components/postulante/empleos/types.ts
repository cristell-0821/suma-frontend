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

export interface Sector {
  id: string;
  nombre: string;
}

export interface Ciudad {
  id: string;
  nombre: string;
  departamento?: {
    id: string;
    nombre: string;
  };
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
  sectorId?: string;
  sector?: Sector;
  ciudadId?: string;
  ciudad?: Ciudad;
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
  ciudadId?: string;
  ciudad?: Ciudad;
  modalidadPreferida?: string;
  sectorId?: string;
  sector?: Sector;
  ciudadPreferidaId?: string;
  ciudadPreferida?: Ciudad;
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