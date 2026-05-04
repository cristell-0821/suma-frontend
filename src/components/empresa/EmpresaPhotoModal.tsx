import { useState, useEffect, useCallback } from 'react';
import { X, Upload, Trash2, Loader2, Building2,} from 'lucide-react';
import { useLogoEmpresaUpload } from '../../hooks/useLogoEmpresaUpload';
import { usePortadaEmpresaUpload } from '../../hooks/usePortadaEmpresaUpload';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'logo' | 'portada';
  currentUrl?: string;
  onPhotoUpdate: (url: string | null, type: 'logo' | 'portada') => void;
}

const EmpresaPhotoModal = ({ isOpen, onClose, type, currentUrl, onPhotoUpdate }: Props) => {
  const [previewUrl, setPreviewUrl] = useState(currentUrl || null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLogo = type === 'logo';
  const title = isLogo ? 'Logo de empresa' : 'Foto de portada';

  const {
    fileInputRef,
    isUploading,
    uploadError,
    openFilePicker,
    handleFileChange,
    clearError,
  } = isLogo ? useLogoEmpresaUpload() : usePortadaEmpresaUpload();

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentUrl || null);
      clearError();
    }
  }, [isOpen, currentUrl, clearError]);

  // Lock scroll
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

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = await handleFileChange(e);
      if (url) {
        setPreviewUrl(url);
      }
    },
    [handleFileChange]
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setPreviewUrl(null);
    setIsDeleting(false);
  };

  const handleSave = () => {
    onPhotoUpdate(previewUrl, type);
    onClose();
  };

  const handleCancel = () => {
    setPreviewUrl(currentUrl || null);
    onClose();
  };

  if (!isOpen) return null;

  const hasChanges = previewUrl !== currentUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brown font-sans">{title}</h2>
          <button
            onClick={handleCancel}
            className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center hover:bg-cream-100 transition-colors"
          >
            <X className="w-4 h-4 text-brown" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <div
              className={`relative overflow-hidden bg-cream-100 flex items-center justify-center transition-all ${
                isLogo
                  ? 'w-40 h-40 rounded-2xl'
                  : 'w-full h-48 rounded-xl'
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className={`text-cream-300 ${isLogo ? 'w-16 h-16' : 'w-20 h-20'}`} />
              )}

              {/* Overlay de carga */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {uploadError && (
            <p className="text-center text-sm text-red-500">{uploadError}</p>
          )}

          {/* Acciones */}
          <div className="grid grid-cols-2 gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUploading || isDeleting}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal text-white font-medium hover:bg-teal-600 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? 'Subiendo...' : 'Actualizar'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isUploading || isDeleting || !previewUrl}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cream-200 flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-cream-200 text-brown font-medium hover:bg-cream-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex-1 px-4 py-2.5 rounded-xl bg-teal text-white font-bold hover:bg-teal-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpresaPhotoModal;