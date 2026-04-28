import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Star,
  ArrowRight,
  Globe,
  DollarSign,
  Briefcase,
  Upload,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { uploadService } from '../../../services/upload.service';
import type { PostulanteProfile } from '../empleos/types';

interface Props {
  profile: PostulanteProfile;
  onProfileUpdate?: (updated: Partial<PostulanteProfile>) => void; // callback para actualizar el padre
}

const ProfileSidebar = ({ profile, onProfileUpdate }: Props) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleCVClick = () => {
    // Si ya tiene CV, abrirlo. Si no, abrir el input de archivo
    if (profile.cvUrl) {
      window.open(profile.cvUrl, '_blank', 'noopener,noreferrer');
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones básicas
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Solo se permiten PDF, JPG, PNG o WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('El archivo no puede superar los 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await uploadService.uploadCV(file);

      // Notificar al padre para que actualice el perfil
      onProfileUpdate?.({
        cvUrl: result.url,
      });
    } catch (err: any) {
      setUploadError(
        err.response?.data?.message || 'Error al subir el CV. Intenta de nuevo.'
      );
    } finally {
      setIsUploading(false);
      // Limpiar input para poder seleccionar el mismo archivo otra vez
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* Input oculto para subir archivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* REDES SOCIALES */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-lg font-bold text-brown mb-4 font-sans">
          Redes y contacto
        </h2>
        <div className="space-y-3">
          {/* LinkedIn */}
          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 hover:bg-[#0077B5]/10 transition-colors group border border-transparent hover:border-[#0077B5]/20"
            >
              <div className="w-10 h-10 bg-[#0077B5]/10 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-[#0077B5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brown group-hover:text-[#0077B5]">
                  LinkedIn
                </p>
                <p className="text-xs text-brown/50 truncate">Ver perfil profesional</p>
              </div>
              <ArrowRight className="w-4 h-4 text-brown/30 group-hover:text-[#0077B5]" />
            </a>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 opacity-50">
              <div className="w-10 h-10 bg-brown/5 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-brown/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown/40">LinkedIn</p>
                <p className="text-xs text-brown/30">No agregado</p>
              </div>
            </div>
          )}

          {/* Portfolio */}
          {profile.portfolio ? (
            <a
              href={profile.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 hover:bg-teal-50 transition-colors group border border-transparent hover:border-teal/20"
            >
              <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brown group-hover:text-teal">
                  Portfolio
                </p>
                <p className="text-xs text-brown/50 truncate">Ver trabajos</p>
              </div>
              <ArrowRight className="w-4 h-4 text-brown/30 group-hover:text-teal" />
            </a>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 opacity-50">
              <div className="w-10 h-10 bg-brown/5 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-brown/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown/40">Portfolio</p>
                <p className="text-xs text-brown/30">No agregado</p>
              </div>
            </div>
          )}

          {/* Salario esperado */}
          {profile.salarioEsperado ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50">
              <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown">Expectativa salarial</p>
                <p className="text-xs text-brown/50">
                  S/ {profile.salarioEsperado.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 opacity-50">
              <div className="w-10 h-10 bg-brown/5 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-brown/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown/40">
                  Expectativa salarial
                </p>
                <p className="text-xs text-brown/30">No especificado</p>
              </div>
            </div>
          )}

          {/* CV - MODIFICADO para subir/ver */}
          <button
            onClick={handleCVClick}
            disabled={isUploading}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors group border border-transparent text-left ${
              profile.cvUrl
                ? 'bg-cream-50 hover:bg-teal-50 hover:border-teal/20 cursor-pointer'
                : 'bg-cream-50 hover:bg-teal-50 hover:border-teal/20 cursor-pointer'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                profile.cvUrl ? 'bg-teal/10' : 'bg-brown/5'
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-teal animate-spin" />
              ) : profile.cvUrl ? (
                <CheckCircle2 className="w-5 h-5 text-teal" />
              ) : (
                <Upload className="w-5 h-5 text-brown/30 group-hover:text-teal" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  profile.cvUrl
                    ? 'text-brown group-hover:text-teal'
                    : 'text-brown/40 group-hover:text-teal'
                }`}
              >
                {isUploading
                  ? 'Subiendo...'
                  : profile.cvUrl
                  ? 'Currículum'
                  : 'Subir currículum'}
              </p>
              <p className="text-xs text-brown/50 truncate">
                {isUploading
                  ? 'Espere un momento'
                  : profile.cvUrl
                  ? 'Ver documento'
                  : 'PDF, JPG, PNG o WEBP (máx. 5MB)'}
              </p>
            </div>
            {!isUploading && profile.cvUrl && (
              <ArrowRight className="w-4 h-4 text-brown/30 group-hover:text-teal" />
            )}
            {!isUploading && !profile.cvUrl && (
              <Upload className="w-4 h-4 text-brown/30 group-hover:text-teal" />
            )}
          </button>

          {/* Error de upload */}
          {uploadError && (
            <p className="text-xs text-red-500 px-3">{uploadError}</p>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section className="bg-coral text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2 font-sans">¿Buscando empleo?</h3>
        <p className="text-sm opacity-90 mb-4">
          Explora las vacantes disponibles y postula a las que mejor se adapten a
          tu perfil.
        </p>
        <button
          onClick={() => navigate('/postulante/empleos')}
          className="inline-flex items-center gap-2 font-bold text-sm hover:gap-3 transition-all"
        >
          Ver empleos <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Stats */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-lg font-bold text-brown mb-4 font-sans">
          Tu actividad
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="font-bold text-brown">
                {(profile as any).applicationsCount ?? 0}
              </p>
              <p className="text-xs text-brown/50">Postulaciones enviadas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral-50 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-coral" />
            </div>
            <div>
              <p className="font-bold text-brown">
                {(profile as any).savedJobsCount ?? 0}
              </p>
              <p className="text-xs text-brown/50">Empleos guardados</p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default ProfileSidebar;