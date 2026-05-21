/** Where the crest sits on screen (normalized 0–1) — faces are nudged away from here */
const CREST = { x: 0.5, y: 0.38, radiusX: 0.22, radiusY: 0.2 };

/** Preferred region for face clusters on the landing slide (below the crest) */
const FACE_TARGET = { x: 0.5, y: 0.72 };

export const DEFAULT_SLIDE_POSITION = '50% 32%';

type FacePrediction = {
  topLeft: [number, number];
  bottomRight: [number, number];
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function faceCentroid(faces: FacePrediction[], imgW: number, imgH: number) {
  let sx = 0;
  let sy = 0;
  for (const f of faces) {
    sx += (f.topLeft[0] + f.bottomRight[0]) / 2;
    sy += (f.topLeft[1] + f.bottomRight[1]) / 2;
  }
  return { x: sx / faces.length / imgW, y: sy / faces.length / imgH };
}

function inCrestZone(nx: number, ny: number) {
  const dx = Math.abs(nx - CREST.x) / CREST.radiusX;
  const dy = Math.abs(ny - CREST.y) / CREST.radiusY;
  return dx < 1 && dy < 1;
}

/**
 * Pick background-position so detected faces sit below the crest, not behind it.
 */
export function backgroundPositionForFaces(
  faces: FacePrediction[],
  imgW: number,
  imgH: number,
): string {
  if (!faces.length || imgW <= 0 || imgH <= 0) {
    return DEFAULT_SLIDE_POSITION;
  }

  const { x: nx, y: ny } = faceCentroid(faces, imgW, imgH);

  if (!inCrestZone(nx, ny)) {
    const posX = clamp(Math.round(50 + (nx - FACE_TARGET.x) * 30), 20, 80);
    const posY = clamp(Math.round(50 + (ny - FACE_TARGET.y) * 40), 18, 82);
    return `${posX}% ${posY}%`;
  }

  const posX = nx < CREST.x ? 28 : 72;
  const posY = ny < CREST.y ? 22 : 76;
  return `${posX}% ${posY}%`;
}

export function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}
