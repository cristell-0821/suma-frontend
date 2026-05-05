// src/pages/postulante/PerfilPage.tsx

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfileHeader from '../../components/postulante/perfil/ProfileHeader';
import ProfileInfo from '../../components/postulante/perfil/ProfileInfo';
import ProfileSidebar from '../../components/postulante/perfil/ProfileSidebar';
import ProfileEditModal, { type ProfileUpdatePayload } from '../../components/postulante/perfil/ProfileEditModal';
import { postulanteService } from '../../services/postulanteService';
import { disabilitiesService } from '../../services/disabilitiesService';
import type { PostulanteProfile, Disability } from '../../components/postulante/empleos/types';
import ProfilePhotoModal from '../../components/postulante/perfil/ProfilePhotoModal';
import { useAuthStore } from '../../stores/authStore';

const PerfilPage = () => {
  const [profile, setProfile] = useState<PostulanteProfile | null>(null);
  const [allDisabilities, setAllDisabilities] = useState<Disability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const updateUserPhoto = useAuthStore((s) => s.updateUserPhoto);

  useEffect(() => {
    loadProfile();
    loadDisabilities();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await postulanteService.getProfile();
      setProfile(data);
      if (data.fotoPerfil) {
        updateUserPhoto(data.fotoPerfil);
      }
      setError('');
    } catch {
      setError('Error al cargar tu perfil');
    } finally {
      setLoading(false);
    }
  };

  const loadDisabilities = async () => {
    try {
      const data = await disabilitiesService.getAll();
      setAllDisabilities(data);
    } catch {
      // Silencioso, no es crítico
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCloseEdit = () => setIsEditing(false);

  const handleSave = async (formData: ProfileUpdatePayload) => {
    setSaving(true);
    try {
      // Limpiar campos vacíos antes de enviar
      const cleanPayload: ProfileUpdatePayload = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => 
          v !== '' && v !== undefined && !(Array.isArray(v) && v.length === 0)
        )
      ) as ProfileUpdatePayload;

      await postulanteService.updateProfile(cleanPayload);
      await loadProfile();
      setIsEditing(false);
      setError('');
    } catch (err: any) {
      console.error('Error al guardar:', err.response?.data);
      setError(err.response?.data?.message || 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleCVUpload = (cvUrl: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      return { ...prev, cvUrl };
    });
  };

  const handleFotoUpload = (fotoUrl: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      return { ...prev, fotoPerfil: fotoUrl };
    });
  };

  const handlePhotoUpdate = async (fotoUrl: string | null) => {
    try {
      await postulanteService.updateProfilePhoto(fotoUrl);
      await loadProfile();
    } catch (err: any) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Error al actualizar la foto');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-32">
          <p className="text-brown/40 text-lg">{error || 'Perfil no encontrado'}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ProfileHeader
          profile={profile}
          onEdit={handleEdit}
          onPhotoClick={() => setIsPhotoModalOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ProfileInfo profile={profile} />
          <ProfileSidebar
            profile={profile}
            onProfileUpdate={(updates) => {
              setProfile((prev) => {
                if (!prev) return null;
                return { ...prev, ...updates };
              });
            }}
          />
        </div>
      </div>

      {/* Modal de edición de datos */}
      <ProfileEditModal
        profile={profile}
        allDisabilities={allDisabilities}
        isOpen={isEditing}
        onClose={handleCloseEdit}
        onSave={handleSave}
        onCVUpload={handleCVUpload}
        onFotoUpload={handleFotoUpload}
        isSaving={saving}
      />

      {/* Modal de foto de perfil */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={profile.fotoPerfil}
        onPhotoUpdate={handlePhotoUpdate}
      />
    </DashboardLayout>
  );
};

export default PerfilPage;