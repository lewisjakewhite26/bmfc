import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { slideshowImages } from '../config/slideshowImages';

interface SlideshowProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

const CROSSFADE_MS = 2000;

export const Slideshow: React.FC<SlideshowProps> = ({
  currentSlideIndex,
  setCurrentSlideIndex,
}) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capturedExitRef = useRef<{ index: number; transform: string } | null>(
    null,
  );
  const currentIndexRef = useRef(currentSlideIndex);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);

  useEffect(() => {
    currentIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  const advanceSlide = useCallback(() => {
    const outgoingIndex = currentIndexRef.current;
    const outgoingEl = slideRefs.current[outgoingIndex];
    if (outgoingEl) {
      capturedExitRef.current = {
        index: outgoingIndex,
        transform: window.getComputedStyle(outgoingEl).transform,
      };
      setExitingIndex(outgoingIndex);
      window.setTimeout(() => {
        setExitingIndex((current) =>
          current === outgoingIndex ? null : current,
        );
      }, CROSSFADE_MS);
    }

    setCurrentSlideIndex((prev) => (prev + 1) % slideshowImages.length);
  }, [setCurrentSlideIndex]);

  useEffect(() => {
    timerRef.current = setInterval(advanceSlide, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advanceSlide]);

  useLayoutEffect(() => {
    if (capturedExitRef.current === null) return;

    const { index, transform } = capturedExitRef.current;
    capturedExitRef.current = null;

    const el = slideRefs.current[index];
    if (!el) return;

    el.style.transform = transform;
    el.style.animation = 'none';

    const timeout = window.setTimeout(() => {
      el.style.transform = '';
      el.style.animation = '';
    }, CROSSFADE_MS);

    return () => window.clearTimeout(timeout);
  }, [currentSlideIndex]);

  return (
    <div className="slideshow">
      {slideshowImages.map((src, index) => {
        const isActive = index === currentSlideIndex;
        const isExiting = index === exitingIndex;

        return (
          <div
            key={src}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className={[
              'slide',
              isActive ? 'active' : '',
              isExiting ? 'exiting' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ backgroundImage: `url(${src})` }}
          />
        );
      })}
    </div>
  );
};
