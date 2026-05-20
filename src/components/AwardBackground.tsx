import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const BAND_COUNT = 4;

export function AwardBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bands = root.querySelectorAll<HTMLElement>('.award-bg__band');
    const tweens: gsap.core.Tween[] = [];

    bands.forEach((band, i) => {
      const state = { multiplier: 0, stop1: 0, stop2: 50 };

      const apply = () => {
        band.style.setProperty('--multiplier', `${state.multiplier}%`);
        band.style.setProperty('--stop-1', `${state.stop1}%`);
        band.style.setProperty('--stop-2', `${state.stop2}%`);
      };

      apply();

      tweens.push(
        gsap.to(state, {
          multiplier: 28,
          stop1: 12,
          stop2: 62,
          duration: 8 + i * 1.4,
          delay: i * 0.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          onUpdate: apply,
        }),
      );
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={rootRef} className="award-bg" aria-hidden="true">
      <div className="award-bg__gradients">
        {Array.from({ length: BAND_COUNT }, (_, i) => (
          <div key={i} className="award-bg__band" />
        ))}
      </div>
      <div className="award-bg__vignette" />
    </div>
  );
}
