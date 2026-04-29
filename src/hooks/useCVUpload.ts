
import { useRef, useState, useCallback } from 'react';
import { uploadService } from '../services/upload.service';

interface UseCVUploadReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  uploadError: string | null;
  openFilePicker: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<string | null>;
  clearError: () => void;
}

export const useCVUpload = (): UseCVUploadReturn => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<string | null> => {
      const file = e.target.files?.[0];
      if (!file) return null;

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Solo se permiten PDF, JPG, PNG o WEBP');
        return null;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('El archivo no puede superar los 5MB');
        return null;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        const result = await uploadService.uploadCV(file);
        return result.url;
      } catch (err: any) {
        setUploadError(
          err.response?.data?.message || 'Error al subir el CV. Intenta de nuevo.'
        );
        return null;
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    []
  );

  return {
    fileInputRef,
    isUploading,
    uploadError,
    openFilePicker,
    handleFileChange,
    clearError,
  };
};
