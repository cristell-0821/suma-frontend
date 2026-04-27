import { User, MapPin, Pencil, Briefcase } from 'lucide-react';
import type { PostulanteProfile } from '../empleos/types';

interface Props {
  profile: PostulanteProfile;
  onEdit: () => void;
}

const ProfileHeader = ({ profile, onEdit }: Props) => {
  const fullName = `${profile.nombres || ''} ${profile.apellidos || ''}`.trim() || 'Postulante';

  return (
    <section className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal to-teal-600 p-8 md:p-12 text-white">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
        {/* Avatar con foto de perfil */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center shrink-0">
          {profile.fotoPerfil ? (
            <img
              src={profile.fotoPerfil}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 md:w-16 md:h-16 text-white/80" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 font-sans">
            {fullName}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/80">
            {profile.disabilities?.length > 0 && (
              <span className="flex items-center gap-1.5 text-sm">
                <Briefcase className="w-4 h-4" />
                {profile.disabilities.map(d => d.nombre).join(', ')}
              </span>
            )}
            {profile.ciudad && (
              <span className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4" />
                {profile.ciudad}
              </span>
            )}
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={onEdit}
          className="bg-coral text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-coral-600 active:scale-95 transition-all shadow-lg shrink-0"
        >
          <Pencil className="w-4 h-4" />
          Editar Perfil
        </button>
      </div>
    </section>
  );
};

export default ProfileHeader;