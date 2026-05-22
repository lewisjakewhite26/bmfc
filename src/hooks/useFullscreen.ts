import { useCallback, useEffect, useState } from 'react';

function isFullscreenActive(): boolean {
  return !!(
    document.fullscreenElement ??
    (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
  );
}

async function requestAppFullscreen(): Promise<void> {
  const el = document.documentElement;
  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return;
    }
    const webkit = el as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
    if (webkit.webkitRequestFullscreen) {
      await webkit.webkitRequestFullscreen();
    }
  } catch {
    /* User denied or API unavailable */
  }
}

async function exitAppFullscreen(): Promise<void> {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
      return;
    }
    const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> };
    if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    }
  } catch {
    /* Already exited */
  }
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(isFullscreenActive);

  useEffect(() => {
    const sync = () => setIsFullscreen(isFullscreenActive());
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, []);

  const enter = useCallback(() => requestAppFullscreen(), []);
  const exit = useCallback(() => exitAppFullscreen(), []);

  const toggle = useCallback(async () => {
    if (isFullscreenActive()) {
      await exitAppFullscreen();
    } else {
      await requestAppFullscreen();
    }
  }, []);

  return { isFullscreen, enter, exit, toggle };
}
