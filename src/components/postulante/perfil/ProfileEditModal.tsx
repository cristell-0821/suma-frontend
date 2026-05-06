import { useState, useEffect } from 'react';
import { X, Globe, DollarSign, FileText, Upload, Loader2 } from 'lucide-react';
import { useCVUpload } from '../../../hooks/useCVUpload';
import type { PostulanteProfile, Disability, Sector, Ciudad } from '../empleos/types';
import { sectorsService } from '../../../services/sectorsService';
import { locationsService } from '../../../services/locationsService';
import type { Departamento } from '../../../services/locationsService';

// ============================================
// INTERFAZ PARA EL FORMULARIO INTERNO
// ============================================
export interface ProfileFormData {
  nombres: string;
  apellidos: string;
  telefono: string;
  ciudadId: string;
  ciudadNombre: string;
  fechaNacimiento: string;
  sobreMi: string;
  skills: string[];
  salarioEsperado: number | string;
  linkedin: string;
  portfolio: string;
  fotoPerfil: string;
  modalidadPreferida: string;
  sectorId: string;
  sectorNombre: string;
  ciudadPreferidaId: string;
  ciudadPreferidaNombre: string;
  disabilityIds: string[];
}

// ============================================
// INTERFAZ PARA ENVIAR AL BACKEND
// ============================================
export interface ProfileUpdatePayload {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  ciudadId?: string;
  fechaNacimiento?: string;
  sobreMi?: string;
  skills?: string[];
  salarioEsperado?: number | null;
  linkedin?: string;
  portfolio?: string;
  fotoPerfil?: string;
  modalidadPreferida?: string;
  sectorId?: string;
  ciudadPreferidaId?: string;
  disabilityIds?: string[];
}

// ============================================
// PROPS
// ============================================
interface Props {
  profile: PostulanteProfile;
  allDisabilities: Disability[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileUpdatePayload) => void;
  onCVUpload?: (cvUrl: string) => void;
  onFotoUpload?: (fotoUrl: string) => void;
  isSaving?: boolean;
}

const MODALIDADES = ['REMOTO', 'HIBRIDO', 'PRESENCIAL'];

const ProfileEditModal = ({ profile, allDisabilities, isOpen, onClose, onSave, onCVUpload, isSaving }: Props) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    nombres: '',
    apellidos: '',
    telefono: '',
    ciudadId: '',
    ciudadNombre: '',
    fechaNacimiento: '',
    sobreMi: '',
    skills: [],
    salarioEsperado: '',
    linkedin: '',
    portfolio: '',
    fotoPerfil: '',
    modalidadPreferida: '',
    sectorId: '',
    sectorNombre: '',
    ciudadPreferidaId: '',
    ciudadPreferidaNombre: '',
    disabilityIds: [],
  });

  // Datos para los selects
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [, setCiudadesPreferidas] = useState<Ciudad[]>([]);
  const [loadingSectores, setLoadingSectores] = useState(false);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);

  const [skillInput, setSkillInput] = useState('');

  const {
    fileInputRef,
    isUploading: isUploadingCV,
    uploadError: cvUploadError,
    openFilePicker,
    handleFileChange,
    clearError: clearCVError,
  } = useCVUpload();

  // Cargar sectores y departamentos al abrir
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoadingSectores(true);
      setLoadingDepartamentos(true);
      try {
        const [sectoresData, deptosData] = await Promise.all([
          sectorsService.getAll(),
          locationsService.getDepartamentos(),
        ]);
        setSectores(sectoresData);
        setDepartamentos(deptosData);
      } catch {
        // Silencioso o manejar error
      } finally {
        setLoadingSectores(false);
        setLoadingDepartamentos(false);
      }
    };

    loadData();
  }, [isOpen]);

  // Cargar ciudades cuando cambia el departamento de ciudad actual
  useEffect(() => {
    if (!formData.ciudadId || departamentos.length === 0) return;

    const loadCiudades = async () => {
      // Encontrar el departamento que contiene esta ciudad
      for (const depto of departamentos) {
        const ciudadEnDepto = depto.ciudades.find(c => c.id === formData.ciudadId);
        if (ciudadEnDepto) {
          const ciudadesData = await locationsService.getCiudadesByDepartamento(depto.id);
          setCiudades(ciudadesData);
          break;
        }
      }
    };

    loadCiudades();
  }, [formData.ciudadId, departamentos]);

  // Cargar ciudades cuando cambia el departamento de ciudad preferida
  useEffect(() => {
    if (!formData.ciudadPreferidaId || departamentos.length === 0) return;

    const loadCiudades = async () => {
      for (const depto of departamentos) {
        const ciudadEnDepto = depto.ciudades.find(c => c.id === formData.ciudadPreferidaId);
        if (ciudadEnDepto) {
          const ciudadesData = await locationsService.getCiudadesByDepartamento(depto.id);
          setCiudadesPreferidas(ciudadesData);
          break;
        }
      }
    };

    loadCiudades();
  }, [formData.ciudadPreferidaId, departamentos]);

  // Inicializar formulario desde el perfil
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        nombres: profile.nombres || '',
        apellidos: profile.apellidos || '',
        telefono: profile.telefono || '',
        ciudadId: profile.ciudad?.id || '',
        ciudadNombre: profile.ciudad?.nombre || '',
        fechaNacimiento: profile.fechaNacimiento ? profile.fechaNacimiento.split('T')[0] : '',
        sobreMi: profile.sobreMi || '',
        skills: profile.skills || [],
        salarioEsperado: profile.salarioEsperado ?? '',
        linkedin: profile.linkedin || '',
        portfolio: profile.portfolio || '',
        fotoPerfil: profile.fotoPerfil || '',
        modalidadPreferida: profile.modalidadPreferida || '',
        sectorId: profile.sector?.id || '',
        sectorNombre: profile.sector?.nombre || '',
        ciudadPreferidaId: profile.ciudadPreferida?.id || '',
        ciudadPreferidaNombre: profile.ciudadPreferida?.nombre || '',
        disabilityIds: profile.disabilities?.map(d => d.id) || [],
      });
      clearCVError();
    }
  }, [isOpen, profile, clearCVError]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ProfileFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Manejar cambio de departamento para ciudad actual
  const handleDepartamentoCiudadChange = async (deptoId: string) => {
    if (!deptoId) {
      setCiudades([]);
      handleChange('ciudadId', '');
      return;
    }
    try {
      const ciudadesData = await locationsService.getCiudadesByDepartamento(deptoId);
      setCiudades(ciudadesData);
      handleChange('ciudadId', ''); // Reset ciudad al cambiar departamento
    } catch {
      setCiudades([]);
    }
  };

  // Manejar cambio de departamento para ciudad preferida
  /* const handleDepartamentoCiudadPreferidaChange = async (deptoId: string) => {
    if (!deptoId) {
      setCiudadesPreferidas([]);
      handleChange('ciudadPreferidaId', '');
      return;
    }
    try {
      const ciudadesData = await locationsService.getCiudadesByDepartamento(deptoId);
      setCiudadesPreferidas(ciudadesData);
      handleChange('ciudadPreferidaId', '');
    } catch {
      setCiudadesPreferidas([]);
    }
  }; */

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      handleChange('skills', [...formData.skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    handleChange('skills', formData.skills.filter(s => s !== skill));
  };

  const toggleDisability = (id: string) => {
    const newIds = formData.disabilityIds.includes(id)
      ? formData.disabilityIds.filter(did => did !== id)
      : [...formData.disabilityIds, id];
    handleChange('disabilityIds', newIds);
  };

  const handleCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = await handleFileChange(e);
    if (url && onCVUpload) {
      onCVUpload(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ProfileUpdatePayload = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      telefono: formData.telefono.trim() || undefined,
      ciudadId: formData.ciudadId || undefined,
      fechaNacimiento: formData.fechaNacimiento
        ? new Date(formData.fechaNacimiento).toISOString()
        : undefined,
      sobreMi: formData.sobreMi.trim() || undefined,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      salarioEsperado: formData.salarioEsperado === '' ? null : Number(formData.salarioEsperado),
      linkedin: formData.linkedin.trim() || undefined,
      portfolio: formData.portfolio.trim() || undefined,
      fotoPerfil: formData.fotoPerfil.trim() || undefined,
      modalidadPreferida: formData.modalidadPreferida || undefined,
      sectorId: formData.sectorId || undefined,
      ciudadPreferidaId: formData.ciudadPreferidaId || undefined,
      disabilityIds: formData.disabilityIds.length > 0 ? formData.disabilityIds : undefined,
    };

    onSave(payload);
  };

  // Encontrar departamento seleccionado para cada ciudad
  const getDepartamentoIdForCiudad = (ciudadId: string) => {
    for (const depto of departamentos) {
      if (depto.ciudades.some(c => c.id === ciudadId)) {
        return depto.id;
      }
    }
    return '';
  };

  const deptoCiudadId = getDepartamentoIdForCiudad(formData.ciudadId);
  //const deptoCiudadPreferidaId = getDepartamentoIdForCiudad(formData.ciudadPreferidaId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-brown font-sans">Editar perfil</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            <X className="w-4 h-4 text-brown" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* === DATOS PERSONALES === */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Datos personales</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Nombres</label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={e => handleChange('nombres', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Apellidos</label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={e => handleChange('apellidos', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={e => handleChange('telefono', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="+51 987 654 321"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={e => handleChange('fechaNacimiento', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>

              {/* CIUDAD ACTUAL - Select en cascada */}
              <div className="sm:col-span-2 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brown mb-1.5">Departamento</label>
                  <select
                    value={deptoCiudadId}
                    onChange={e => handleDepartamentoCiudadChange(e.target.value)}
                    disabled={loadingDepartamentos}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all disabled:opacity-50"
                  >
                    <option value="">Seleccionar departamento...</option>
                    {departamentos.map(d => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown mb-1.5">Ciudad</label>
                  <select
                    value={formData.ciudadId}
                    onChange={e => handleChange('ciudadId', e.target.value)}
                    disabled={!deptoCiudadId}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all disabled:opacity-50"
                  >
                    <option value="">Seleccionar ciudad...</option>
                    {ciudades.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* === SOBRE MÍ === */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Sobre mí</h3>
            <textarea
              value={formData.sobreMi}
              onChange={e => handleChange('sobreMi', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all resize-none"
              placeholder="Cuéntanos sobre ti, tu experiencia y lo que buscas..."
            />
          </section>

          {/* === LINKS Y EXPECTATIVAS === */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Links y expectativas</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5 flex items-center gap-1.5">
                  <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-4 h-4" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={e => handleChange('linkedin', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-teal" /> Portfolio
                </label>
                <input
                  type="url"
                  value={formData.portfolio}
                  onChange={e => handleChange('portfolio', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="https://tusitio.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-coral" /> Salario esperado (S/)
                </label>
                <input
                  type="number"
                  value={formData.salarioEsperado}
                  onChange={e => {
                    const val = e.target.value;
                    handleChange('salarioEsperado', val === '' ? '' : Number(val));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="4500"
                  min={0}
                />
              </div>
              {/* CV */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal" /> Currículum
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleCVFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={isUploadingCV}
                  className="w-full flex items-center gap-2 px-4 py-2.5 h-[46px] rounded-xl border border-cream-200 bg-cream-50 text-brown hover:bg-teal-50 hover:border-teal/30 transition-all text-left"
                >
                  <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center shrink-0">
                    {isUploadingCV ? (
                      <Loader2 className="w-4 h-4 text-teal animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-teal" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brown">
                      {isUploadingCV
                        ? 'Subiendo nuevo CV...'
                        : profile.cvUrl
                        ? 'Reemplazar currículum'
                        : 'Subir currículum'}
                    </p>
                  </div>
                </button>
                {cvUploadError && (
                  <p className="text-xs text-red-500 mt-1.5">{cvUploadError}</p>
                )}
              </div>
            </div>
          </section>

          {/* === HABILIDADES === */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Habilidades</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                placeholder="React, TypeScript, Diseño UX..."
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2.5 bg-teal text-white rounded-xl font-medium hover:bg-teal-600 transition-colors"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <span
                  key={skill}
                  className="bg-teal-50 text-teal px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center hover:bg-teal/30 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {formData.skills.length === 0 && (
                <p className="text-brown/30 text-sm italic">Sin habilidades agregadas</p>
              )}
            </div>
          </section>

          {/* === PREFERENCIAS === */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Preferencias de empleo</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Modalidad preferida</label>
                <select
                  value={formData.modalidadPreferida}
                  onChange={e => handleChange('modalidadPreferida', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                >
                  <option value="">Seleccionar...</option>
                  {MODALIDADES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* SECTOR - Ahora desde API */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Sector preferido</label>
                <select
                  value={formData.sectorId}
                  onChange={e => handleChange('sectorId', e.target.value)}
                  disabled={loadingSectores}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all disabled:opacity-50"
                >
                  <option value="">Seleccionar...</option>
                  {sectores.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* === DISCAPACIDADES === */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">Discapacidades</h3>
            <div className="flex flex-wrap gap-2">
              {allDisabilities.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDisability(d.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.disabilityIds.includes(d.id)
                      ? 'bg-teal text-white shadow-md'
                      : 'bg-cream-50 text-brown/60 border border-cream-200 hover:bg-cream-100'
                  }`}
                >
                  {d.nombre}
                </button>
              ))}
            </div>
          </section>

          {/* === BOTONES === */}
          <div className="flex gap-3 pt-4 border-t border-cream-200 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-cream-200 text-brown font-medium hover:bg-cream-50 transition-colors"
              disabled={isSaving || isUploadingCV}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingCV}
              className="flex-1 px-6 py-3 rounded-xl bg-teal text-white font-bold hover:bg-teal-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;