/** Touch / narrow viewports — keep motion, drop expensive effects (blur, layout morph, ML). */
export const PERF_LITE_MEDIA =
  '(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 900px)';

export function getIsPerfLite(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(PERF_LITE_MEDIA).matches;
}

export function syncPerformanceProfileClass(): void {
  document.documentElement.classList.toggle('perf-lite', getIsPerfLite());
}

export function watchPerformanceProfile(onChange: () => void): () => void {
  const mq = window.matchMedia(PERF_LITE_MEDIA);
  const handler = () => {
    syncPerformanceProfileClass();
    onChange();
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
