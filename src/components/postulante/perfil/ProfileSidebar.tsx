import { useNavigate } from 'react-router-dom';
import { FileText, Star, ArrowRight, Globe, DollarSign, Briefcase } from 'lucide-react';
import type { PostulanteProfile } from '../empleos/types';

interface Props {
  profile: PostulanteProfile;
}

const ProfileSidebar = ({ profile }: Props) => {
  const navigate = useNavigate();

  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* Discapacidades */}
      {/* <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-lg font-bold text-brown mb-4 font-sans">Discapacidades</h2>
        {profile.disabilities?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.disabilities.map((d) => (
              <span
                key={d.id}
                className="bg-teal-50 text-teal px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {d.nombre}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-brown/40 text-sm">No especificado</p>
        )}
      </section> */}

      {/* REDES SOCIALES - NUEVA SECCIÓN */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-lg font-bold text-brown mb-4 font-sans">Redes y contacto</h2>
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
                <p className="text-sm font-medium text-brown group-hover:text-[#0077B5]">LinkedIn</p>
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
                <p className="text-sm font-medium text-brown group-hover:text-teal">Portfolio</p>
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
                <p className="text-xs text-brown/50">S/ {profile.salarioEsperado.toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 opacity-50">
              <div className="w-10 h-10 bg-brown/5 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-brown/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown/40">Expectativa salarial</p>
                <p className="text-xs text-brown/30">No especificado</p>
              </div>
            </div>
          )}

          {/* CV */}
          {profile.cvUrl ? (
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 hover:bg-teal-50 transition-colors group border border-transparent hover:border-teal/20"
            >
              <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brown group-hover:text-teal">Currículum</p>
                <p className="text-xs text-brown/50 truncate">Ver documento</p>
              </div>
              <ArrowRight className="w-4 h-4 text-brown/30 group-hover:text-teal" />
            </a>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 opacity-50">
              <div className="w-10 h-10 bg-brown/5 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-brown/30" />
              </div>
              <div>
                <p className="text-sm font-medium text-brown/40">Currículum</p>
                <p className="text-xs text-brown/30">No subido</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section className="bg-coral text-white rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-2 font-sans">¿Buscando empleo?</h3>
        <p className="text-sm opacity-90 mb-4">
          Explora las vacantes disponibles y postula a las que mejor se adapten a tu perfil.
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
        <h2 className="text-lg font-bold text-brown mb-4 font-sans">Tu actividad</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="font-bold text-brown">{(profile as any).applicationsCount ?? 0}</p>
              <p className="text-xs text-brown/50">Postulaciones enviadas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral-50 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-coral" />
            </div>
            <div>
              <p className="font-bold text-brown">{(profile as any).savedJobsCount ?? 0}</p>
              <p className="text-xs text-brown/50">Empleos guardados</p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default ProfileSidebar;