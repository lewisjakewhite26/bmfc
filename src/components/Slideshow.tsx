import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { slideshowImages } from '../config/awards';

interface SlideshowProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const Slideshow: React.FC<SlideshowProps> = ({
  currentSlideIndex,
  setCurrentSlideIndex,
}) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Refs to each slide DOM element so we can read computed transforms
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Holds the captured transform and slide index of the slide that is about to exit
  const capturedExitRef = useRef<{ index: number; transform: string } | null>(null);
  // Tracks the current index without causing re-renders (avoids stale closure in interval)
  const currentIndexRef = useRef(currentSlideIndex);

  useEffect(() => {
    currentIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  // Called each tick — captures the live transform of the outgoing slide BEFORE React re-renders
  const advanceSlide = useCallback(() => {
    const outgoingEl = slideRefs.current[currentIndexRef.current];
    if (outgoingEl) {
      // Read the mid-animation computed transform (e.g. matrix(1.03, 0, 0, 1.03, 0, 0))
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

  // Fires synchronously after DOM update but BEFORE the browser paints.
  // At this point React has already removed `.active` from the old slide and
  // the animation has stopped — but we override the snapped transform with the
  // captured value, so the user never sees the snap.
  useLayoutEffect(() => {
    if (capturedExitRef.current === null) return;

    const { index, transform } = capturedExitRef.current;
    capturedExitRef.current = null;

    const el = slideRefs.current[index];
    if (!el) return;

    el.style.transform = transform;

    // Clear the inline style after the opacity transition completes.
    // The slide is fully transparent by this point, so no snap is visible.
    const timeout = setTimeout(() => {
      if (el) el.style.transform = '';
    }, 2200);

    return () => clearTimeout(timeout);
  }, [currentSlideIndex]);

  return (
    <>
      <div className="slideshow">
        {slideshowImages.map((src, index) => (
          <div
            key={src}
            ref={(el) => { slideRefs.current[index] = el; }}
            className={`slide ${index === currentSlideIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </>
  );
};
