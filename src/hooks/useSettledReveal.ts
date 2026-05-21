import { useCallback, useState } from 'react';

/** Track which steps/lines have finished their entrance animation. */
export function useSettledReveal() {
  const [settled, setSettled] = useState<Set<number>>(() => new Set());

  const isSettled = useCallback((id: number) => settled.has(id), [settled]);

  const shouldAnimate = useCallback(
    (id: number, isVisible: boolean) => isVisible && !settled.has(id),
    [settled],
  );

  const markSettled = useCallback((id: number) => {
    setSettled((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return { isSettled, shouldAnimate, markSettled };
}
