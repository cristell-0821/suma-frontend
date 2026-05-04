import { useState, useEffect } from 'react';
import { X, MapPin, Building2 } from 'lucide-react';
import { locationsService } from '../../services/locationsService';
import { sectorsService } from '../../services/sectorsService';
import type { EmpresaProfile, UpdateEmpresaPayload } from '../../services/empresaService';
import type { Departamento, Ciudad } from '../../services/locationsService';
import type { Sector } from '../../services/sectorsService';

interface Props {
  empresa: EmpresaProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateEmpresaPayload) => void;
  isSaving?: boolean;
}

const TAMAÑOS = ['Pequeña (1-50)', 'Mediana (51-250)', 'Grande (250+)'];

const EmpresaEditModal = ({ empresa, isOpen, onClose, onSave, isSaving }: Props) => {
  const [formData, setFormData] = useState<UpdateEmpresaPayload>({});
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [departamentoId, setDepartamentoId] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar datos del backend
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Cargar ciudades cuando cambia departamento
  useEffect(() => {
    if (departamentoId) {
      loadCiudades(departamentoId);
    } else {
      setCiudades([]);
    }
  }, [departamentoId]);

  // Setear datos iniciales cuando abre
  useEffect(() => {
    if (isOpen && empresa) {
      setFormData({
        razonSocial: empresa.razonSocial || '',
        ruc: empresa.ruc || '',
        sectorId: empresa.sectorId || '',
        tamaño: empresa.tamaño || '',
        descripcion: empresa.descripcion || '',
        sitioWeb: empresa.sitioWeb || '',
        ciudadId: empresa.ciudadId || '',
        direccion: empresa.direccion || '',
        nombreContacto: empresa.nombreContacto || '',
        cargoContacto: empresa.cargoContacto || '',
        telefonoContacto: empresa.telefonoContacto || '',
        accommodations: empresa.accommodations || [],
      });

      // Encontrar departamento de la ciudad actual
      if (empresa.ciudad?.departamento?.id) {
        setDepartamentoId(empresa.ciudad.departamento.id);
      } else if (empresa.ciudadId && departamentos.length > 0) {
        const depto = departamentos.find(d => 
          d.ciudades.some(c => c.id === empresa.ciudadId)
        );
        if (depto) setDepartamentoId(depto.id);
      }
    }
  }, [isOpen, empresa, departamentos]);

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

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptos, sects] = await Promise.all([
        locationsService.getDepartamentos(),
        sectorsService.getAll(),
      ]);
      setDepartamentos(deptos);
      setSectores(sects);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCiudades = async (deptoId: string) => {
    try {
      const data = await locationsService.getCiudadesByDepartamento(deptoId);
      setCiudades(data);
    } catch {
      setCiudades([]);
    }
  };

  if (!isOpen) return null;

  const handleChange = (field: keyof UpdateEmpresaPayload, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDepartamentoChange = (value: string) => {
    setDepartamentoId(value);
    handleChange('ciudadId', ''); // Reset ciudad
  };

  const handleAccommodationAdd = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !formData.accommodations?.includes(trimmed)) {
      handleChange('accommodations', [...(formData.accommodations || []), trimmed]);
    }
  };

  const handleAccommodationRemove = (acc: string) => {
    handleChange(
      'accommodations',
      (formData.accommodations || []).filter((a) => a !== acc)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin w-8 h-8 border-4 border-teal border-t-transparent rounded-full mx-auto" />
          <p className="text-brown mt-4 text-center">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-brown font-sans">Editar perfil de empresa</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            <X className="w-4 h-4 text-brown" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Datos básicos */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">
              Datos de la empresa
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Razón social</label>
                <input
                  type="text"
                  value={formData.razonSocial || ''}
                  onChange={(e) => handleChange('razonSocial', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">RUC</label>
                <input
                  type="text"
                  value={formData.ruc || ''}
                  onChange={(e) => handleChange('ruc', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>
              
              {/* Sector - select desde BD */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Sector</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40 pointer-events-none" />
                  <select
                    value={formData.sectorId || ''}
                    onChange={(e) => handleChange('sectorId', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all appearance-none"
                  >
                    <option value="">Seleccionar sector...</option>
                    {sectores.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Tamaño</label>
                <select
                  value={formData.tamaño || ''}
                  onChange={(e) => handleChange('tamaño', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all appearance-none"
                >
                  <option value="">Seleccionar...</option>
                  {TAMAÑOS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Descripción */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">
              Sobre la empresa
            </h3>
            <textarea
              value={formData.descripcion || ''}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all resize-none"
              placeholder="Cuéntanos sobre tu empresa, cultura y propósito..."
            />
          </section>

          {/* Ubicación y web */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">
              Ubicación y presencia
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Departamento</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40 pointer-events-none" />
                  <select
                    value={departamentoId}
                    onChange={(e) => handleDepartamentoChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all appearance-none"
                  >
                    <option value="">Seleccionar departamento...</option>
                    {departamentos.map((d) => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Ciudad</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40 pointer-events-none" />
                  <select
                    value={formData.ciudadId || ''}
                    onChange={(e) => handleChange('ciudadId', e.target.value)}
                    disabled={!departamentoId}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {departamentoId ? 'Seleccionar ciudad...' : 'Primero elige un departamento'}
                    </option>
                    {ciudades.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Dirección</label>
                <input
                  type="text"
                  value={formData.direccion || ''}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-brown mb-1.5">Sitio web</label>
                <input
                  type="url"
                  value={formData.sitioWeb || ''}
                  onChange={(e) => handleChange('sitioWeb', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Nombre de contacto</label>
                <input
                  type="text"
                  value={formData.nombreContacto || ''}
                  onChange={(e) => handleChange('nombreContacto', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1.5">Cargo</label>
                <input
                  type="text"
                  value={formData.cargoContacto || ''}
                  onChange={(e) => handleChange('cargoContacto', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-brown mb-1.5">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefonoContacto || ''}
                  onChange={(e) => handleChange('telefonoContacto', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  placeholder="+51 987 654 321"
                />
              </div>
            </div>
          </section>

          {/* Acomodaciones */}
          <section>
            <h3 className="text-sm font-bold text-brown/50 uppercase tracking-wider mb-4">
              Acomodaciones disponibles
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.accommodations?.map((acc) => (
                <span
                  key={acc}
                  className="bg-teal-50 text-teal px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"
                >
                  {acc}
                  <button
                    type="button"
                    onClick={() => handleAccommodationRemove(acc)}
                    className="w-4 h-4 rounded-full bg-teal/20 flex items-center justify-center hover:bg-teal/30 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Escribe y presiona Enter..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAccommodationAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-200 bg-cream-50 text-brown focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
          </section>

          {/* Botones */}
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

export default EmpresaEditModal;