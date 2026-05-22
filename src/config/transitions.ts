/** Text + bullet lines. */
export interface TransitionSlideCopy {
  variant?: 'copy';
  title: string;
  lines: string[];
}

/** Crest + title + season — scene change between award blocks. */
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
