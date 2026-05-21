/** Shared easing for presentation screens */
export const smoothEase = [0.4, 0, 0.2, 1] as const;

export type AwardPace = 'joke' | 'serious';

const PACE = {
  joke: { fade: 0.8, stagger: 0.12, between: 0.45, winnerLift: 10 },
  serious: { fade: 1.4, stagger: 0.22, between: 0.55, winnerLift: 0 },
} as const;

export function awardFadeIn(pace: AwardPace, delay = 0) {
  const { fade, stagger } = PACE[pace];
  return { duration: fade, ease: smoothEase, delay: delay || stagger };
}

export function awardBetweenScreen(pace: AwardPace) {
  return { duration: PACE[pace].between, ease: smoothEase };
}

export function awardWinnerIn(pace: AwardPace) {
  const { fade, stagger, winnerLift } = PACE[pace];
  return {
    opacity: { duration: fade, ease: smoothEase, delay: stagger },
    y: { duration: fade, ease: smoothEase, delay: stagger },
    initialY: winnerLift,
  };
}
