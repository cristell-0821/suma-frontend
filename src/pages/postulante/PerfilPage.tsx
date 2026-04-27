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

const PerfilPage = () => {
  const [profile, setProfile] = useState<PostulanteProfile | null>(null);
  const [allDisabilities, setAllDisabilities] = useState<Disability[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadProfile();
    loadDisabilities();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await postulanteService.getProfile();
      setProfile(data);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async (formData: ProfileUpdatePayload) => {
    setSaving(true);
    try {
      await postulanteService.updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
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
        <ProfileHeader profile={profile} onEdit={handleEdit} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ProfileInfo profile={profile} />
          <ProfileSidebar profile={profile} />
        </div>
      </div>

      {/* Modal de edición */}
      <ProfileEditModal
        profile={profile}
        allDisabilities={allDisabilities}
        isOpen={isEditing}
        onClose={handleCloseEdit}
        onSave={handleSave}
        isSaving={saving}
      />
    </DashboardLayout>
  );
};

export default PerfilPage;