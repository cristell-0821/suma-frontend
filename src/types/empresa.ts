export interface Vacante {
  id: string;
  titulo: string;
  descripcion: string;
  requisitos: string[];
  funciones: string[];
  modalidad: string;
  sectorId: string;
  sector?: { id: string; nombre: string };
  ciudadId: string;
  ciudad?: { id: string; nombre: string; departamento?: { id: string; nombre: string } };
  salarioMin?: number;
  salarioMax?: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  disabilityIds?: string[];
  disabilities?: { id: string; nombre: string }[];
  empresaId?: string;
  _count?: { applications: number };
}