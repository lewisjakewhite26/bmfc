import type { Award } from './awards';
import { jokeAwards, seriousAwards } from './awards';
import type { TransitionSlide } from './transitions';

export type PresentationFlow = 'jokes-first' | 'serious-first';

const BLOCK_INTERLUDE_SEASON = '2025 · 26';

export function secondBlockStartIndex(flow: PresentationFlow): number {
  return flow === 'jokes-first' ? jokeAwards.length : seriousAwards.length;
}

export function composeAwards(flow: PresentationFlow): Award[] {
  return flow === 'jokes-first'
    ? [...jokeAwards, ...seriousAwards]
    : [...seriousAwards, ...jokeAwards];
}

/** Crest interlude immediately before the second award block. */
export function interludesForFlow(flow: PresentationFlow): Record<number, TransitionSlide> {
  const secondBlockStart = secondBlockStartIndex(flow);

  const title =
    flow === 'jokes-first' ? 'The Main Awards' : 'Recognition Awards';

  return {
    [secondBlockStart]: {
      variant: 'main-awards',
      title,
      season: BLOCK_INTERLUDE_SEASON,
    },
  };
}
