import { useState, useEffect } from 'react';
import { X, Rocket, Loader2, Lightbulb, Plus, Minus, MapPin, Building2 } from 'lucide-react';
import { disabilitiesService } from '../../services/disabilitiesService';
import { empresaService } from '../../services/empresaService';
import { locationsService } from '../../services/locationsService';
import { sectorsService } from '../../services/sectorsService';
import type { Vacante } from '../../types/empresa';
import type { Disability } from '../../components/postulante/empleos/types';
import type { Departamento, Ciudad } from '../../services/locationsService';
import type { Sector } from '../../services/sectorsService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingVacante?: Vacante | null;
}

const MODALIDADES = ['REMOTO', 'HIBRIDO', 'PRESENCIAL'] as const;
type Modalidad = typeof MODALIDADES[number];

const VacanteFormModal = ({ isOpen, onClose, onSuccess, editingVacante }: Props) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    requisitos: [''] as string[],
    funciones: [''] as string[],
    modalidad: 'HIBRIDO' as Modalidad,
    sectorId: '',
    departamentoId: '',
    ciudadId: '',
    salarioMin: '',
    salarioMax: '',
    disabilityIds: [] as string[],
  });

  const [allDisabilities, setAllDisabilities] = useState<Disability[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del backend
  useEffect(() => {
    if (isOpen) {
      loadDisabilities();
      loadLocations();
      loadSectors();
    }
  }, [isOpen]);

  // Cargar ciudades cuando cambia el departamento
  useEffect(() => {
    if (formData.departamentoId) {
      loadCiudades(formData.departamentoId);
    } else {
      setCiudades([]);
    }
  }, [formData.departamentoId]);

  // Setear datos cuando editamos
  useEffect(() => {
    if (isOpen && editingVacante) {
      // Encontrar el departamento de la ciudad actual
      const depto = departamentos.find(d => 
        d.ciudades.some(c => c.id === editingVacante.ciudadId)
      );

      setFormData({
        titulo: editingVacante.titulo,
        descripcion: editingVacante.descripcion,
        requisitos: editingVacante.requisitos?.length ? editingVacante.requisitos : [''],
        funciones: editingVacante.funciones?.length ? editingVacante.funciones : [''],
        modalidad: editingVacante.modalidad as Modalidad,
        sectorId: editingVacante.sectorId || '',
        departamentoId: depto?.id || '',
        ciudadId: editingVacante.ciudadId || '',
        salarioMin: editingVacante.salarioMin?.toString() || '',
        salarioMax: editingVacante.salarioMax?.toString() || '',
        disabilityIds: editingVacante.disabilityIds || editingVacante.disabilities?.map(d => d.id) || [],
      });
    } else if (isOpen && !editingVacante) {
      setFormData({
        titulo: '',
        descripcion: '',
        requisitos: [''],
        funciones: [''],
        modalidad: 'HIBRIDO',
        sectorId: '',
        departamentoId: '',
        ciudadId: '',
        salarioMin: '',
        salarioMax: '',
        disabilityIds: [],
      });
      setCiudades([]);
    }
    setError('');
  }, [isOpen, editingVacante, departamentos]);

  // Bloquear scroll del body
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const loadDisabilities = async () => {
    try {
      const data = await disabilitiesService.getAll();
      setAllDisabilities(data);
    } catch {
      // Silencioso
    }
  };

  const loadLocations = async () => {
    try {
      const data = await locationsService.getDepartamentos();
      setDepartamentos(data);
    } catch {
      // Silencioso
    }
  };

  const loadCiudades = async (departamentoId: string) => {
    try {
      const data = await locationsService.getCiudadesByDepartamento(departamentoId);
      setCiudades(data);
    } catch {
      setCiudades([]);
    }
  };

  const loadSectors = async () => {
    try {
      const data = await sectorsService.getAll();
      setSectores(data);
    } catch {
      // Silencioso
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDepartamentoChange = (departamentoId: string) => {
    setFormData(prev => ({
      ...prev,
      departamentoId,
      ciudadId: '', // Reset ciudad al cambiar departamento
    }));
  };

  const addField = (field: 'requisitos' | 'funciones') => {
    handleChange(field, [...formData[field], '']);
  };

  const removeField = (field: 'requisitos' | 'funciones', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    handleChange(field, updated.length ? updated : ['']);
  };

  const updateField = (field: 'requisitos' | 'funciones', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    handleChange(field, updated);
  };

  const toggleDisability = (id: string) => {
    const current = formData.disabilityIds;
    if (current.includes(id)) {
      handleChange('disabilityIds', current.filter(d => d !== id));
    } else {
      handleChange('disabilityIds', [...current, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        requisitos: formData.requisitos.filter(r => r.trim() !== ''),
        funciones: formData.funciones.filter(f => f.trim() !== ''),
        modalidad: formData.modalidad,
        sectorId: formData.sectorId,
        ciudadId: formData.ciudadId,
        salarioMin: formData.salarioMin ? parseInt(formData.salarioMin) : undefined,
        salarioMax: formData.salarioMax ? parseInt(formData.salarioMax) : undefined,
        disabilityIds: formData.disabilityIds,
      };

      if (editingVacante) {
        await empresaService.updateJobOffer(editingVacante.id, payload);
      } else {
        await empresaService.createJobOffer(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar la vacante');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="flex min-h-full items-start justify-center p-4">
        <div className="relative bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-cream-200 px-8 py-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-3xl font-extrabold text-brown font-sans tracking-tight">
                {editingVacante ? 'Editar Vacante' : 'Publicar Empleo'}
              </h2>
              <p className="text-brown/60 mt-1">
                {editingVacante 
                  ? 'Actualiza los detalles de tu vacante' 
                  : 'Encuentra el talento que tu empresa necesita'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5 text-brown" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Sección 1: Detalles de la Posición */}
            <section className="bg-cream-50 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-bl-full" />
              <h3 className="text-xl font-bold text-brown mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-teal" />
                </span>
                Detalles de la Posición
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-brown mb-2">Nombre del Puesto *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={e => handleChange('titulo', e.target.value)}
                    className="w-full px-6 py-4 rounded-xl border-none bg-white text-brown text-lg placeholder:text-brown/30 focus:ring-2 focus:ring-teal/30 shadow-sm"
                    placeholder="Ej. Desarrollador Fullstack Senior"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brown mb-2">Descripción de la Vacante *</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={e => handleChange('descripcion', e.target.value)}
                    rows={6}
                    className="w-full px-6 py-4 rounded-xl border-none bg-white text-brown placeholder:text-brown/30 focus:ring-2 focus:ring-teal/30 shadow-sm resize-none"
                    placeholder="Cuéntanos sobre el rol y la misión del equipo..."
                    required
                  />
                </div>

                {/* Requisitos */}
                <div>
                  <label className="block text-sm font-semibold text-brown mb-2">Requisitos y Habilidades</label>
                  <div className="space-y-2">
                    {formData.requisitos.map((req, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={req}
                          onChange={e => updateField('requisitos', idx, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border-none bg-white text-brown placeholder:text-brown/30 focus:ring-2 focus:ring-teal/30 shadow-sm"
                          placeholder={`Requisito ${idx + 1}`}
                        />
                        {formData.requisitos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField('requisitos', idx)}
                            className="p-3 rounded-xl bg-cream-100 text-brown/60 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addField('requisitos')}
                      className="text-teal font-medium text-sm flex items-center gap-1 hover:text-teal-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Agregar requisito
                    </button>
                  </div>
                </div>

                {/* Funciones */}
                <div>
                  <label className="block text-sm font-semibold text-brown mb-2">Funciones del puesto</label>
                  <div className="space-y-2">
                    {formData.funciones.map((func, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={func}
                          onChange={e => updateField('funciones', idx, e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border-none bg-white text-brown placeholder:text-brown/30 focus:ring-2 focus:ring-teal/30 shadow-sm"
                          placeholder={`Función ${idx + 1}`}
                        />
                        {formData.funciones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeField('funciones', idx)}
                            className="p-3 rounded-xl bg-cream-100 text-brown/60 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addField('funciones')}
                      className="text-teal font-medium text-sm flex items-center gap-1 hover:text-teal-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Agregar función
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Sección 2: Modalidad, Sector y Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Modalidad */}
              <div className="bg-cream-50 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-brown flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-teal-50 flex items-center justify-center">
                    <Rocket className="w-3 h-3 text-teal" />
                  </span>
                  Modalidad
                </h3>
                <div className="flex flex-col gap-2">
                  {MODALIDADES.map(m => (
                    <label
                      key={m}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                        formData.modalidad === m
                          ? 'bg-teal-50 border-2 border-teal'
                          : 'bg-white border-2 border-transparent hover:bg-cream-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modalidad"
                        value={m}
                        checked={formData.modalidad === m}
                        onChange={e => handleChange('modalidad', e.target.value)}
                        className="text-teal focus:ring-teal"
                      />
                      <span className="font-medium text-brown capitalize">{m.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sector y Ubicación */}
              <div className="md:col-span-2 bg-cream-50 rounded-2xl p-6">
                <h3 className="font-bold text-brown mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-teal-50 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-teal" />
                  </span>
                  Sector y Ubicación
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Sector */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-brown mb-2">Sector *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40 pointer-events-none" />
                      <select
                        value={formData.sectorId}
                        onChange={e => handleChange('sectorId', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white text-brown focus:ring-2 focus:ring-teal/30 shadow-sm appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Seleccionar sector...</option>
                        {sectores.map(s => (
                          <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Departamento */}
                  <div>
                    <label className="block text-sm font-semibold text-brown mb-2">Departamento *</label>
                    <select
                      value={formData.departamentoId}
                      onChange={e => handleDepartamentoChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-none bg-white text-brown focus:ring-2 focus:ring-teal/30 shadow-sm appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Seleccionar departamento...</option>
                      {departamentos.map(d => (
                        <option key={d.id} value={d.id}>{d.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm font-semibold text-brown mb-2">Ciudad *</label>
                    <select
                      value={formData.ciudadId}
                      onChange={e => handleChange('ciudadId', e.target.value)}
                      disabled={!formData.departamentoId}
                      className="w-full px-4 py-3 rounded-xl border-none bg-white text-brown focus:ring-2 focus:ring-teal/30 shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="" disabled>
                        {formData.departamentoId ? 'Seleccionar ciudad...' : 'Primero elige un departamento'}
                      </option>
                      {ciudades.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rango Salarial */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-brown mb-2">Rango Salarial (Opcional)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={formData.salarioMin}
                        onChange={e => handleChange('salarioMin', e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-none bg-white text-brown focus:ring-2 focus:ring-teal/30 shadow-sm"
                        placeholder="Mínimo S/"
                        min={0}
                      />
                      <span className="font-bold text-teal">a</span>
                      <input
                        type="number"
                        value={formData.salarioMax}
                        onChange={e => handleChange('salarioMax', e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border-none bg-white text-brown focus:ring-2 focus:ring-teal/30 shadow-sm"
                        placeholder="Máximo S/"
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 3: Discapacidades compatibles */}
            <section className="bg-cream-50 border-l-8 border-teal rounded-2xl p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brown">Discapacidades compatibles</h3>
                  <p className="text-brown/60 mt-1">
                    Selecciona las discapacidades que tu entorno laboral puede acomodar.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {allDisabilities.map(d => (
                  <label key={d.id} className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.disabilityIds.includes(d.id)}
                      onChange={() => toggleDisability(d.id)}
                      className="hidden peer"
                    />
                    <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                      formData.disabilityIds.includes(d.id)
                        ? 'bg-teal-50 border-teal text-teal'
                        : 'bg-white border-cream-200 text-brown/60 hover:bg-cream-100'
                    }`}>
                      {d.nombre}
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-4 text-sm text-brown/50 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Tip: Seleccionar discapacidades ayuda a conectar con los candidatos ideales.
              </p>
            </section>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-cream-200">
              <button
                type="button"
                onClick={onClose}
                className="text-brown/60 font-bold px-8 py-4 hover:text-brown transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-teal text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-teal-600 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    {editingVacante ? 'Guardar Cambios' : 'Publicar Vacante'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VacanteFormModal;