import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Building2, FileText, Users, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { locationsService } from '../../../services/locationsService';
import { sectorsService } from '../../../services/sectorsService';
import type { Departamento, Ciudad } from '../../../services/locationsService';
import type { Sector } from '../../../services/sectorsService';

interface Step1EmpresaProps {
  onContinue: (data: {
    razonSocial: string;
    ruc: string;
    sectorId: string;
    tamaño: string;
    ciudadId: string;
  }) => void;
  onBack: () => void;
}

const TAMAÑOS = ['Pequeña (1-10)', 'Mediana (11-50)', 'Grande (51-200)', 'Corporativo (200+)'];

const Step1Empresa = ({ onContinue, onBack }: Step1EmpresaProps) => {
  const [formData, setFormData] = useState({
    razonSocial: '',
    ruc: '',
    sectorId: '',
    tamaño: '',
    departamentoId: '',
    ciudadId: '',
  });

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.departamentoId) {
      loadCiudades(formData.departamentoId);
    } else {
      setCiudades([]);
    }
  }, [formData.departamentoId]);

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

  const loadCiudades = async (departamentoId: string) => {
    try {
      const data = await locationsService.getCiudadesByDepartamento(departamentoId);
      setCiudades(data);
    } catch {
      setCiudades([]);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Reset ciudad al cambiar departamento
      if (field === 'departamentoId') {
        updated.ciudadId = '';
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.razonSocial.trim() || !formData.ruc.trim() || !formData.sectorId || !formData.tamaño || !formData.ciudadId) {
      return;
    }
    onContinue({
      razonSocial: formData.razonSocial.trim(),
      ruc: formData.ruc.trim(),
      sectorId: formData.sectorId,
      tamaño: formData.tamaño,
      ciudadId: formData.ciudadId,
    });
  };

  const isFormValid = formData.razonSocial.trim() && formData.ruc.trim() && formData.sectorId && formData.tamaño && formData.ciudadId;

  const progress = 50;
  const navigate = useNavigate();
  const goToLogin = () => { navigate('/login'); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff8f1] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#00694c] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f1] text-[#201b0f] flex flex-col">
      {/* Header */}
      <header className="bg-[#fff8f1] flex items-center justify-between px-6 py-4 w-full sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-[#1D9E75] cursor-pointer active:scale-95 duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={goToLogin}
            className="text-teal font-bold font-['Plus_Jakarta_Sans'] hover:underline transition-all"
          >
            Ya tengo cuenta
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-4 flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="mb-6 shrink-0">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[#a8380f] font-bold text-sm tracking-widest uppercase">
              Progreso del Registro
            </span>
            <span className="text-[#a8380f] font-bold text-2xl">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-[#f3e7d3] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#fd7549] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-6 shrink-0">
          <h2 className="text-4xl font-extrabold text-[#00694c] mb-2 leading-tight font-['Plus_Jakarta_Sans']">
            Datos de tu empresa
          </h2>
          <p className="text-lg text-[#3d4943]">
            Cuéntanos sobre tu organización para conectar con talento diverso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          {/* Grid de campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Razón Social */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Razón Social *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="text"
                  value={formData.razonSocial}
                  onChange={(e) => handleChange('razonSocial', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="Ej. Tech Inclusiva SAC"
                  required
                />
              </div>
            </div>

            {/* RUC */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">RUC *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73]" />
                <input
                  type="text"
                  value={formData.ruc}
                  onChange={(e) => handleChange('ruc', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all font-medium placeholder:text-[#6d7a73]/50 outline-none text-sm"
                  placeholder="20123456789"
                  maxLength={11}
                  required
                />
              </div>
            </div>

            {/* Sector */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Sector *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73] pointer-events-none" />
                <select
                  value={formData.sectorId}
                  onChange={(e) => handleChange('sectorId', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all appearance-none outline-none text-sm"
                  required
                >
                  <option value="" disabled>Seleccionar sector...</option>
                  {sectores.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tamaño */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Tamaño de empresa *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73] pointer-events-none" />
                <select
                  value={formData.tamaño}
                  onChange={(e) => handleChange('tamaño', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all appearance-none outline-none text-sm"
                  required
                >
                  <option value="" disabled>Seleccionar tamaño...</option>
                  {TAMAÑOS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Departamento */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Departamento *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73] pointer-events-none" />
                <select
                  value={formData.departamentoId}
                  onChange={(e) => handleChange('departamentoId', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all appearance-none outline-none text-sm"
                  required
                >
                  <option value="" disabled>Seleccionar departamento...</option>
                  {departamentos.map((d) => (
                    <option key={d.id} value={d.id}>{d.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ciudad */}
            <div className="space-y-1">
              <label className="block text-[#201b0f] font-semibold text-sm ml-2">Ciudad *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7a73] pointer-events-none" />
                <select
                  value={formData.ciudadId}
                  onChange={(e) => handleChange('ciudadId', e.target.value)}
                  disabled={!formData.departamentoId}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-[#f3e7d3] focus:ring-2 focus:ring-[#00694c] transition-all appearance-none outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="" disabled>
                    {formData.departamentoId ? 'Seleccionar ciudad...' : 'Primero elige un departamento'}
                  </option>
                  {ciudades.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer action */}
          <div className="flex items-center justify-between pt-4 shrink-0">
            <p className="text-[#3d4943] text-sm italic">
              Los datos serán verificados por nuestro equipo.
            </p>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`
                font-bold text-lg px-10 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg
                ${isFormValid
                  ? 'bg-[#fd7549] text-white hover:opacity-90 active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Siguiente
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Step1Empresa;