export const generateCakeImage = async (
  flavor: string,
  photoUrl: string | null,
  message: string,
  theme: string
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = 1080;
  canvas.height = 1080;

  // 1. Draw Base Flavor Image
  const flavorImages: Record<string, string> = {
    "Chocolate": "/images/custom-cakes/chocolate.jpg",
    "Vanilla": "/images/custom-cakes/vanilla.jpg",
    "Red Velvet": "/images/custom-cakes/red-velvet.jpg",
    "Butterscotch": "/images/custom-cakes/butterscotch.jpg",
    "Black Forest": "/images/custom-cakes/black-forest.jpg",
  };
  const baseImg = await loadImage(flavorImages[flavor] || flavorImages["Chocolate"]);
  ctx.drawImage(baseImg, 0, 0, 1080, 1080);

  // 2. Draw User Photo (Topper)
  if (photoUrl) {
    const userImg = await loadImage(photoUrl);
    ctx.save();

    // Position similar to CSS preview
    const centerX = 540;
    const centerY = 370;
    const radius = 160;

    // Perspective-like transform (approximate)
    ctx.translate(centerX, centerY);
    ctx.scale(1, 0.95); // Slight vertical compression for perspective

    // Draw white border/topper base
    ctx.beginPath();
    ctx.arc(0, 0, radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Clip and draw photo
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.clip();

    // Maintain aspect ratio for user photo
    const aspect = userImg.width / userImg.height;
    let drawW, drawH;
    if (aspect > 1) {
      drawW = radius * 2 * aspect;
      drawH = radius * 2;
    } else {
      drawW = radius * 2;
      drawH = (radius * 2) / aspect;
    }
    ctx.drawImage(userImg, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    // Topper stick
    ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.fillRect(537, 530, 6, 100);
  }

  // 3. Draw Message
  if (message) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // We try to use Dancing Script if loaded, otherwise fallback
    ctx.font = 'bold 80px "Dancing Script", cursive, "Playfair Display", serif';
    ctx.fillText(message, 540, 920);
    ctx.restore();
  }

  // 4. Draw Theme Decorations (Simplified for Canvas)
  const normalizedTheme = theme.toLowerCase();
  if (normalizedTheme.includes('princess')) {
    drawTextOverlay(ctx, '👑', 100, 150, 120);
    drawTextOverlay(ctx, '✨', 980, 150, 100);
  } else if (normalizedTheme.includes('cars')) {
    drawTextOverlay(ctx, '🏎️', 150, 930, 120);
    drawTextOverlay(ctx, '🏁', 930, 930, 120);
  } else if (normalizedTheme.includes('space')) {
    drawTextOverlay(ctx, '🪐', 850, 200, 120);
    drawTextOverlay(ctx, '🚀', 200, 850, 100);
  } else if (normalizedTheme.includes('jungle')) {
    drawTextOverlay(ctx, '🌿', 100, 100, 150);
    drawTextOverlay(ctx, '🌿', 980, 100, 150, true);
    drawTextOverlay(ctx, '🦁', 540, 980, 100);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas to Blob failed'));
    }, 'image/jpeg', 0.9);
  });
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const drawTextOverlay = (
  ctx: CanvasRenderingContext2D,
  emoji: string,
  x: number,
  y: number,
  size: number,
  flip = false
) => {
  ctx.save();
  ctx.font = `${size}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (flip) {
    ctx.translate(x, y);
    ctx.scale(-1, 1);
    ctx.fillText(emoji, 0, 0);
  } else {
    ctx.fillText(emoji, x, y);
  }
  ctx.restore();
};
