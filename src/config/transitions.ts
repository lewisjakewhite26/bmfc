/** Text + bullet lines (e.g. “And There’s More…”). */
export interface TransitionSlideCopy {
  variant?: 'copy';
  title: string;
  lines: string[];
}

/** Crest + title + season — scene change before serious awards. */
export interface TransitionSlideMainAwards {
  variant: 'main-awards';
  title: string;
  season: string;
}

export type TransitionSlide = TransitionSlideCopy | TransitionSlideMainAwards;

export function isMainAwardsInterlude(
  slide: TransitionSlide,
): slide is TransitionSlideMainAwards {
  return slide.variant === 'main-awards';
}

/**
 * Interlude screens inserted immediately before award index N.
 * Index 7: after last joke, before Clubman (Main Awards).
 */
export const interludesBeforeAward: Record<number, TransitionSlide> = {
  7: {
    variant: 'main-awards',
    title: 'The Main Awards',
    season: '2025 · 26',
  },
};

export function interludeScreenCount(): number {
  return Object.keys(interludesBeforeAward).length;
}
