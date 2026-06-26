import { Flavor } from './FlavorSelector';

export const generateCakeComposite = async (
  flavor: Flavor,
  photo: string | null,
  message: string
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // High resolution for quality exports (1080x1080)
  canvas.width = 1080;
  canvas.height = 1080;

  if (!ctx) throw new Error('Could not get canvas context');

  // Helper to load images
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  try {
    // 1. Draw Base Cake
    const cakeImg = await loadImage(flavor.image);
    // Object-cover equivalent for canvas
    const aspect = cakeImg.width / cakeImg.height;
    if (aspect > 1) {
      const w = canvas.height * aspect;
      ctx.drawImage(cakeImg, (canvas.width - w) / 2, 0, w, canvas.height);
    } else {
      const h = canvas.width / aspect;
      ctx.drawImage(cakeImg, 0, (canvas.height - h) / 2, canvas.width, h);
    }

    // 2. Draw Edible Photo (Circular)
    if (photo) {
      const photoImg = await loadImage(photo);
      const size = canvas.width * 0.45;
      const x = (canvas.width - size) / 2;
      const y = canvas.height * 0.2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Object-cover for photo
      const pAspect = photoImg.width / photoImg.height;
      if (pAspect > 1) {
        const pw = size * pAspect;
        ctx.drawImage(photoImg, x + (size - pw) / 2, y, pw, size);
      } else {
        const ph = size / pAspect;
        ctx.drawImage(photoImg, x, y + (size - ph) / 2, size, ph);
      }
      ctx.restore();

      // Border for photo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Draw Message
    if (message) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = 'white';

      const fontSize = message.length > 15 ? 60 : 85;
      ctx.font = `${fontSize}px "Dancing Script", cursive`;
      ctx.textAlign = 'center';

      // If font not loaded in canvas yet, fallback to serif
      if (!document.fonts.check(`${fontSize}px "Dancing Script"`)) {
        ctx.font = `italic bold ${fontSize}px serif`;
      }

      const yPos = photo ? canvas.height * 0.2 + (canvas.width * 0.45) + 120 : canvas.height * 0.5;
      ctx.fillText(message, canvas.width / 2, yPos);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas to Blob conversion failed'));
      }, 'image/jpeg', 0.9);
    });

  } catch (error) {
    console.error('Composite generation failed:', error);
    throw error;
  }
};
