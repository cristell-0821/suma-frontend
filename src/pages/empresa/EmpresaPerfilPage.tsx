import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EmpresaHeader from '../../components/empresa/EmpresaHeader';
import EmpresaInfo from '../../components/empresa/EmpresaInfo';
import EmpresaSidebar from '../../components/empresa/EmpresaSidebar';
import EmpresaEditModal from '../../components/empresa/EmpresaEditModal';
import { empresaService } from '../../services/empresaService';
import type { EmpresaProfile, UpdateEmpresaPayload } from '../../services/empresaService';
import EmpresaPhotoModal from '../../components/empresa/EmpresaPhotoModal';
import { useAuthStore } from '../../stores/authStore';

const EmpresaPerfilPage = () => {
  const [empresa, setEmpresa] = useState<EmpresaProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoType, setPhotoType] = useState<'logo' | 'portada'>('logo');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await empresaService.getProfile();
      setEmpresa(data);
      setError('');
      
      // ← Mover aquí DENTRO del try
      if (data.logoUrl) {
        updateUserLogo(data.logoUrl);
      }
    } catch {
      setError('Error al cargar el perfil de empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: UpdateEmpresaPayload) => {
    setSaving(true);
    try {
      await empresaService.updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
    } catch {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoClick = () => {
    setPhotoType('logo');
    setIsPhotoModalOpen(true);
  };

  const handlePortadaClick = () => {
    setPhotoType('portada');
    setIsPhotoModalOpen(true);
  };

  const updateUserLogo = useAuthStore((s) => s.updateUserLogo);

  const handlePhotoUpdate = async (url: string | null, type: 'logo' | 'portada') => {
    if (!empresa) return;

    try {
      // Guardar en backend
      await empresaService.updateProfile({
        [type === 'logo' ? 'logoUrl' : 'portadaUrl']: url || '',
      });

      // Sincronizar logo en authStore ANTES de recargar
      if (type === 'logo') {
        updateUserLogo(url || undefined);
      }

      // Recargar perfil para sincronizar
      await loadProfile();
    } catch {
      setError('Error al actualizar la imagen');
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

  if (error || !empresa) {
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
        <EmpresaHeader
          empresa={empresa}
          onEdit={() => setIsEditing(true)}
          onLogoClick={handleLogoClick}
          onPortadaClick={handlePortadaClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <EmpresaInfo empresa={empresa} />
          </div>
          <div className="lg:col-span-4">
            <EmpresaSidebar empresa={empresa} />
          </div>
        </div>
      </div>

      <EmpresaEditModal
        empresa={empresa}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        isSaving={saving}
      />
      <EmpresaPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        type={photoType}
        currentUrl={photoType === 'logo' ? empresa.logoUrl : empresa.portadaUrl}
        onPhotoUpdate={handlePhotoUpdate}
      />
    </DashboardLayout>
  );
};

export default EmpresaPerfilPage;