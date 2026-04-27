// src/components/postulante/perfil/ProfileEditModal.tsx

import { useState, useEffect } from 'react';
import { X, Briefcase, Globe, DollarSign, FileText } from 'lucide-react';
import type { PostulanteProfile, Disability } from '../empleos/types';

// ============================================
// INTERFAZ PARA EL FORMULARIO INTERNO
// ============================================
export interface ProfileFormData {
  nombres: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
  fechaNacimiento: string;
  sobreMi: string;
  skills: string[];
  salarioEsperado: number | string;  // Permite string vacío mientras escribe
  linkedin: string;
  portfolio: string;
  cvUrl: string;
  fotoPerfil: string;
  modalidadPreferida: string;
  sectorPreferido: string;
  ciudadPreferida: string;
  disabilityIds: string[];
}

// ============================================
// INTERFAZ PARA ENVIAR AL BACKEND
// ============================================
export interface ProfileUpdatePayload {
  nombres: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
  fechaNacimiento: string;
  sobreMi: string;
  skills: string[];
  salarioEsperado: number | null;  // Backend espera null para vacío
  linkedin: string;
  portfolio: string;
  cvUrl: string;
  fotoPerfil: string;
  modalidadPreferida: string;
  sectorPreferido: string;
  ciudadPreferida: string;
  disabilityIds: string[];
}

// ============================================
// PROPS
// ============================================
interface Props {
  profile: PostulanteProfile;
  allDisabilities: Disability[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileUpdatePayload) => void;  // ← Usa ProfileUpdatePayload
  isSaving?: boolean;
}

const MODALIDADES = ['REMOTO', 'HIBRIDO', 'PRESENCIAL'];
const SECTORES = ['Tecnología', 'Administración', 'Ventas', 'Marketing', 'Educación', 'Salud', 'Manufactura', 'Servicios', 'Otro'];

const ProfileEditModal = ({ profile, allDisabilities, isOpen, onClose, onSave, isSaving }: Props) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    nombres: '',
    apellidos: '',
    telefono: '',
    ciudad: '',
    fechaNacimiento: '',
    sobreMi: '',
    skills: [],
    salarioEsperado: '',
    linkedin: '',
    portfolio: '',
    cvUrl: '',
    fotoPerfil: '',
    modalidadPreferida: '',
    sectorPreferido: '',
    ciudadPreferida: '',
    disabilityIds: [],
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        nombres: profile.nombres || '',
        apellidos: profile.apellidos || '',
        telefono: profile.telefono || '',
        ciudad: profile.ciudad || '',
        fechaNacimiento: profile.fechaNacimiento ? profile.fechaNacimiento.split('T')[0] : '',
        sobreMi: profile.sobreMi || '',
        skills: profile.skills || [],
        salarioEsperado: profile.salarioEsperado ?? '',
        linkedin: profile.linkedin || '',
        portfolio: profile.portfolio || '',
        cvUrl: profile.cvUrl || '',
        fotoPerfil: profile.fotoPerfil || '',
        modalidadPreferida: profile.modalidadPreferida || '',
        sectorPreferido: profile.sectorPreferido || '',
        ciudadPreferida: profile.ciudadPreferida || '',
        disabilityIds: profile.disabilities?.map(d => d.id) || [],
      });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ProfileFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  // ============================================
  // HANDLE SUBMIT — CONVERSIÓN A PAYLOAD
  // ============================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ProfileUpdatePayload = {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      telefono: formData.telefono.trim(),
      ciudad: formData.ciudad.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      sobreMi: formData.sobreMi.trim(),
      skills: formData.skills,
      salarioEsperado: formData.salarioEsperado === '' ? null : Number(formData.salarioEsperado),
      linkedin: formData.linkedin.trim(),
      portfolio: formData.portfolio.trim(),
      cvUrl: formData.cvUrl.trim(),
      fotoPerfil: formData.fotoPerfil.trim(),
      modalidadPreferida: formData.modalidadPreferida,
      sectorPreferido: formData.sectorPreferido.trim(),
      ciudadPreferida: formData.ciudadPreferida.trim(),
      disabilityIds: formData.disabilityIds,
    };

    onSave(payload);
  };

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
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Ciudad</label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={e => handleChange('ciudad', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="Lima"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Foto de perfil (URL)</label>
                <input
                  type="url"
                  value={formData.fotoPerfil}
                  onChange={e => handleChange('fotoPerfil', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="https://..."
                />
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
                  <Briefcase className="w-4 h-4 text-[#0077B5]" /> LinkedIn
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
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal" /> URL del CV
                </label>
                <input
                  type="url"
                  value={formData.cvUrl}
                  onChange={e => handleChange('cvUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="https://storage.suma.pe/cvs/..."
                />
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
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Sector preferido</label>
                <select
                  value={formData.sectorPreferido}
                  onChange={e => handleChange('sectorPreferido', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                >
                  <option value="">Seleccionar...</option>
                  {SECTORES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Ciudad preferida</label>
                <input
                  type="text"
                  value={formData.ciudadPreferida}
                  onChange={e => handleChange('ciudadPreferida', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="Lima"
                />
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
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
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