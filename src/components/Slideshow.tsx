import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { slideshowImages } from '../config/slideshowImages';
import {
  backgroundPositionForFaces,
  DEFAULT_SLIDE_POSITION,
  loadImageElement,
} from '../utils/slideBackgroundPosition';

interface SlideshowProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

const FALLBACK_POSITIONS = [
  '50% 28%',
  '50% 74%',
  '32% 50%',
  '68% 50%',
  '36% 30%',
  '64% 30%',
  '36% 70%',
  '64% 70%',
];

export const Slideshow: React.FC<SlideshowProps> = ({
  currentSlideIndex,
  setCurrentSlideIndex,
}) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capturedExitRef = useRef<{ index: number; transform: string } | null>(null);
  const currentIndexRef = useRef(currentSlideIndex);
  const [slidePositions, setSlidePositions] = useState<string[]>(() =>
    slideshowImages.map((_, i) => FALLBACK_POSITIONS[i % FALLBACK_POSITIONS.length]),
  );

  useEffect(() => {
    currentIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await tf.ready();
        const model = await blazeface.load();
        const positions: string[] = [];

        for (let i = 0; i < slideshowImages.length; i++) {
          if (cancelled) return;

          try {
            const img = await loadImageElement(slideshowImages[i]);
            const faces = await model.estimateFaces(img, false);
            positions[i] = backgroundPositionForFaces(
              faces as { topLeft: [number, number]; bottomRight: [number, number] }[],
              img.naturalWidth,
              img.naturalHeight,
            );
          } catch {
            positions[i] = FALLBACK_POSITIONS[i % FALLBACK_POSITIONS.length];
          }
        }

        if (!cancelled) {
          setSlidePositions(positions);
        }
      } catch {
        /* BlazeFace unavailable — keep offset fallbacks */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const advanceSlide = useCallback(() => {
    const outgoingEl = slideRefs.current[currentIndexRef.current];
    if (outgoingEl) {
      const liveTransform = window.getComputedStyle(outgoingEl).transform;
      capturedExitRef.current = {
        index: currentIndexRef.current,
        transform: liveTransform,
      };
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

    const timeout = setTimeout(() => {
      if (el) el.style.transform = '';
    }, 2200);

    return () => clearTimeout(timeout);
  }, [currentSlideIndex]);

  return (
    <div className="slideshow">
      {slideshowImages.map((src, index) => (
        <div
          key={src}
          ref={(el) => {
            slideRefs.current[index] = el;
          }}
          className={`slide ${index === currentSlideIndex ? 'active' : ''}`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition:
              slidePositions[index] ??
              FALLBACK_POSITIONS[index % FALLBACK_POSITIONS.length] ??
              DEFAULT_SLIDE_POSITION,
          }}
        />
      ))}
    </div>
  );
};
