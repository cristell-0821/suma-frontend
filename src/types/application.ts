export type ApplicationStatus =
  | 'ENVIADO'
  | 'EN_REVISION'
  | 'ENTREVISTA'
  | 'CONTRATADO'
  | 'RECHAZADO';

export interface Application {
  id: string;
  status: ApplicationStatus;
  mensaje?: string;
  createdAt: string;

  postulante: {
    id: string;
    nombres: string;
    apellidos: string;
    fotoPerfil?: string;
    skills?: string[];
    disabilities: { id: string; nombre: string }[];
    user: { email: string };
    ciudad?: { nombre: string };
    sector?: { nombre: string };
    sobreMi?: string;
    cvUrl?: string;
    telefono?: string;
    linkedin?: string;
    portfolio?: string;
    fechaNacimiento?: string;
    salarioEsperado?: number;
  };

  jobOffer: {
    id: string;
    titulo: string;
  };
}