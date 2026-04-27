import { FileText, UserSearch, Zap, Mail, Phone, MapPin, Briefcase, Globe, DollarSign, Calendar, Building2 } from 'lucide-react';
import type { PostulanteProfile } from '../empleos/types';

interface Props {
  profile: PostulanteProfile;
}

const ProfileInfo = ({ profile }: Props) => {
  return (
    <div className="lg:col-span-8 space-y-6">
      {/* Datos básicos */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-xl font-bold text-brown mb-5 font-sans flex items-center gap-2">
          <UserSearch className="w-5 h-5 text-teal" />
          Información de contacto
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-cream-50 rounded-xl p-4">
            <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Email</p>
            <p className="text-brown font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal" />
              {profile.user?.email || 'No especificado'}
            </p>
          </div>
          <div className="bg-cream-50 rounded-xl p-4">
            <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Teléfono</p>
            <p className="text-brown font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal" />
              {profile.telefono || 'No especificado'}
            </p>
          </div>
          <div className="bg-cream-50 rounded-xl p-4">
            <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Ciudad</p>
            <p className="text-brown font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal" />
              {profile.ciudad || 'No especificado'}
            </p>
          </div>
          <div className="bg-cream-50 rounded-xl p-4">
            <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Modalidad preferida</p>
            <p className="text-brown font-medium">
              {profile.modalidadPreferida || 'No especificado'}
            </p>
          </div>
          {profile.fechaNacimiento && (
            <div className="bg-cream-50 rounded-xl p-4">
              <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Fecha de nacimiento</p>
              <p className="text-brown font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal" />
                {new Date(profile.fechaNacimiento).toLocaleDateString('es-PE')}
              </p>
            </div>
          )}
          {profile.sectorPreferido && (
            <div className="bg-cream-50 rounded-xl p-4">
              <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Sector de interés</p>
              <p className="text-brown font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal" />
                {profile.sectorPreferido}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sobre mí */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-xl font-bold text-brown mb-4 font-sans flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal" />
          Sobre mí
        </h2>
        {profile.sobreMi ? (
          <p className="text-brown/70 leading-relaxed whitespace-pre-line">
            {profile.sobreMi}
          </p>
        ) : (
          <div className="bg-cream-50 rounded-xl p-6 text-center">
            <p className="text-brown/40 text-sm">
              Aún no has agregado una descripción. Cuéntanos sobre ti, tu experiencia y lo que buscas.
            </p>
          </div>
        )}
      </section>

      {/* Links y expectativas - NUEVA SECCIÓN */}
      {/* <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-xl font-bold text-brown mb-4 font-sans flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal" />
          Links y expectativas
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream-50 rounded-xl p-4 hover:bg-[#0077B5]/10 transition-colors group border border-transparent hover:border-[#0077B5]/20"
            >
              <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">LinkedIn</p>
              <p className="text-brown font-medium flex items-center gap-2 group-hover:text-[#0077B5]">
                <Briefcase className="w-4 h-4 text-[#0077B5]" />
                <span className="truncate">Ver perfil</span>
              </p>
            </a>
          )}
          {profile.portfolio && (
            <a
              href={profile.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream-50 rounded-xl p-4 hover:bg-teal-50 transition-colors group border border-transparent hover:border-teal/20"
            >
              <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Portfolio</p>
              <p className="text-brown font-medium flex items-center gap-2 group-hover:text-teal">
                <Globe className="w-4 h-4 text-teal" />
                <span className="truncate">Ver portfolio</span>
              </p>
            </a>
          )}
          {profile.salarioEsperado && (
            <div className="bg-cream-50 rounded-xl p-4">
              <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Salario esperado</p>
              <p className="text-brown font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-coral" />
                S/ {profile.salarioEsperado.toLocaleString()}
              </p>
            </div>
          )}
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream-50 rounded-xl p-4 hover:bg-teal-50 transition-colors group border border-transparent hover:border-teal/20"
            >
              <p className="text-xs text-brown/50 uppercase tracking-wider font-medium mb-1">Currículum</p>
              <p className="text-brown font-medium flex items-center gap-2 group-hover:text-teal">
                <FileText className="w-4 h-4 text-teal" />
                <span className="truncate">Ver CV</span>
              </p>
            </a>
          )}
        </div>
        
        {!profile.linkedin && !profile.portfolio && !profile.salarioEsperado && !profile.cvUrl && (
          <div className="bg-cream-50 rounded-xl p-6 text-center">
            <p className="text-brown/40 text-sm">
              Aún no has agregado links ni expectativas salariales.
            </p>
          </div>
        )}
      </section> */}

      {/* Habilidades */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
        <h2 className="text-xl font-bold text-brown mb-4 font-sans flex items-center gap-2">
          <Zap className="w-5 h-5 text-teal" />
          Habilidades
        </h2>
        {profile.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-teal-50 text-teal px-4 py-2 rounded-full font-medium text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="bg-cream-50 rounded-xl p-6 text-center">
            <p className="text-brown/40 text-sm">
              Aún no has agregado habilidades. Agrega las que mejor te representen.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfileInfo;