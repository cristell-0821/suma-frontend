import type { Area } from 'react-easy-crop';

/**
 * Recorta una imagen usando canvas según las coordenadas del cropper.
 * Devuelve un Blob listo para subir.
 */
export const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<Blob | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      0.92
    );
  });
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });