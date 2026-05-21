/** Landing slideshow — served from /public/images */

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed;
  const next = () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const files = shuffleWithSeed(
  [
  'IMG-20250617-WA0019.jpg',
  'IMG-20250802-WA0011.jpg',
  'IMG-20250809-WA0009.jpg',
  'IMG-20250809-WA0011.jpg',
  'IMG-20250809-WA0014.jpg',
  'IMG-20250817-WA0017.jpg',
  'IMG-20250825-WA0000.jpg',
  'IMG-20250827-WA0002.jpg',
  'IMG-20250906-WA0000.jpg',
  'IMG-20250907-WA0006.jpg',
  'IMG-20250921-WA0011.jpg',
  'IMG-20251001-WA0015.jpg',
  'IMG-20251008-WA0010.jpg',
  'IMG-20251012-WA0004.jpg',
  'IMG-20251012-WA0007.jpg',
  'IMG-20251012-WA0009.jpg',
  'IMG-20251016-WA0003.jpg',
  'IMG-20251019-WA0013.jpg',
  'IMG-20251022-WA0002.jpg',
  'IMG-20251026-WA0001.jpg',
  'IMG-20251026-WA0012.jpg',
  'IMG-20251026-WA0020.jpg',
  'IMG-20251026-WA0043.jpg',
  'IMG-20251026-WA0045.jpg',
  'IMG-20251028-WA0006.jpg',
  'IMG-20251114-WA0007.jpg',
  'IMG-20251115-WA0002.jpg',
  'IMG-20251119-WA0000.jpg',
  'IMG-20251204-WA0002.jpg',
  'IMG-20251214-WA0014.jpg',
  'IMG-20251214-WA0031.jpg',
  'IMG-20251215-WA0003.jpg',
  'IMG-20251221-WA0008.jpg',
  'IMG-20251221-WA0012.jpg',
  'IMG-20251221-WA0029.jpg',
  'IMG-20251222-WA0000.jpg',
  'IMG-20251231-WA0006(1).jpg',
  'IMG-20260109-WA0003.jpg',
  'IMG-20260118-WA0030.jpg',
  'IMG-20260118-WA0032.jpg',
  'IMG-20260118-WA0033.jpg',
  'IMG-20260124-WA0023.jpg',
  'IMG-20260125-WA0004.jpg',
  'IMG-20260201-WA0026.jpg',
  'IMG-20260222-WA0004.jpg',
  'IMG-20260315-WA0001.jpg',
  'IMG-20260315-WA0002.jpg',
  'IMG-20260320-WA0009.jpg',
  'IMG-20260411-WA0012.jpg',
  'IMG-20260421-WA0010.jpg',
  'IMG-20260514-WA0005.jpg',
  'IMG-20260515-WA0003.jpg',
  'IMG-20260516-WA0002.jpg',
  ],
  20260520,
);

export const slideshowImages: string[] = files.map(
  (file) => `/images/${encodeURIComponent(file)}`,
);
