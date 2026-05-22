import type { TransitionSlide } from './transitions';
import {
  SLOWEST_RACE_CONFIG,
  slowestRaceWinner,
  type SlowestRaceConfig,
} from './slowestRace';

export function interludeScreenCount(
  interludes: Record<number, TransitionSlide>,
): number {
  return Object.keys(interludes).length;
}

export type AwardType = 'joke' | 'serious';

/** Joke awards only — `slowest-race` adds a 4th screen with the head race. */
export type JokeAwardVariant = 'standard' | 'slowest-race';

export interface Award {
  category: string;
  description: string;
  winner: string;
  type: AwardType;
  variant?: JokeAwardVariant;
  race?: SlowestRaceConfig;
}

export const seasonLabel = '2025 · 26';

/** Joke: title (+ season) → description → winner */
export const SCREENS_PER_JOKE_AWARD = 3;
/** Joke + race: title → description → race (winner celebration at end of race) */
export const SCREENS_PER_SLOWEST_RACE_AWARD = 3;
/** Serious: category (+ season) → award description (no name reveal) */
export const SCREENS_PER_SERIOUS_AWARD = 2;

export function screensPerAward(award: Award): number {
  if (award.type === 'serious') return SCREENS_PER_SERIOUS_AWARD;
  if (award.variant === 'slowest-race') return SCREENS_PER_SLOWEST_RACE_AWARD;
  return SCREENS_PER_JOKE_AWARD;
}

export type AwardSectionScreen =
  | { kind: 'interlude'; slide: TransitionSlide }
  | { kind: 'award'; awardIndex: number; awardStep: number };

export function buildAwardTimeline(
  awardList: Award[],
  interludes: Record<number, TransitionSlide>,
): AwardSectionScreen[] {
  const timeline: AwardSectionScreen[] = [];

  for (let i = 0; i < awardList.length; i++) {
    const interlude = interludes[i];
    if (interlude) {
      timeline.push({ kind: 'interlude', slide: interlude });
    }

    const steps = screensPerAward(awardList[i]);
    for (let step = 0; step < steps; step++) {
      timeline.push({ kind: 'award', awardIndex: i, awardStep: step });
    }
  }

  return timeline;
}

export function totalAwardScreens(
  awardList: Award[],
  interludes: Record<number, TransitionSlide>,
): number {
  return buildAwardTimeline(awardList, interludes).length;
}

export function resolveAwardSectionScreen(
  screenIndex: number,
  awardStart: number,
  awardList: Award[],
  interludes: Record<number, TransitionSlide>,
): AwardSectionScreen | null {
  const offset = screenIndex - awardStart;
  const timeline = buildAwardTimeline(awardList, interludes);
  if (offset < 0 || offset >= timeline.length) return null;
  return timeline[offset] ?? null;
}

export const jokeAwards: Award[] = [
  {
    type: 'joke',
    category: "BMFC's Worst Golfer",
    description:
      'What a fitting way to kick off our awards in such a venue. To be so bad at something, but still turn up and give it your best is a real show of character, and this person does that each and every time.',
    winner: 'Will Denholm',
  },
  {
    type: 'joke',
    category: 'The Most Shouted At',
    description:
      'How many times does one person need telling? I have never known one person to be at fault for so much throughout one season. There is no break for this lad, as the shouting continues during the family sunday dinner too. He needs protection, not aggression.',
    winner: 'Matthew Jones',
  },
  {
    type: 'joke',
    category: 'Ultimate Family Man',
    description:
      'Wanting to bring your wife to see you finish 2nd in the Top Goalscorer award is just bloody lovely, and it really melted my heart when I read it. So I thought this person should have something to take home for the wife.',
    winner: 'Carl Hodges',
  },
  {
    type: 'joke',
    category: 'Dedication to Our Sponsors',
    description:
      "For dedication in supporting our sponsors — this person has been a real injection of cash into our main sponsor's business, shelling out £12 each and every week in order to keep food on the table in the Jones household. Without this person's dedication, there is no way we would have had new strips, warm-up tops or tracksuits this season.",
    winner: 'Jack Marley',
  },
  {
    type: 'joke',
    category: "World's Biggest Shithouse",
    description:
      'Making promises to your fellow team mates is something that should always be backed up. During the season this person told everybody that he would honour such a promise. A vote in the group decided the outcome, such a democratic decision. However, once the beer had worn off, and with the threat of a relationship breakdown, the promise was broken. Pope John Paul.... the TURD 💩',
    winner: 'Harvey Ryder',
  },
  {
    type: 'joke',
    category: 'The Halls Soother Award',
    description:
      'Communication on a football pitch is paramount. Passion. Leadership. Accountability. Whatever is said on the pitch is left there after the 90 minutes. However, sometimes it is the way that you say things that leaves the biggest impact.',
    winner: 'James Marshall',
  },
  {
    type: 'joke',
    category: 'Best Dribbler',
    description:
      "Not everyone can be the best at everything. However, this lad's dribbling is off the charts.",
    winner: 'Jack Scanlon',
  },
  {
    type: 'joke',
    category: 'All Tourque No Break Horsepower',
    description:
      'Football is a passionate sport, which sometimes spills over into aggression. Aggression is key, but only when you are actually on the pitch. This award goes to someone who dropped a grenade in the battlezone then hid behind the real footsoldiers.',
    winner: 'Conner Noades',
  },
  {
    type: 'joke',
    category: 'Fairplay Award',
    description:
      'The game is built on the values of respect — no matter what the situation, respect must run through every part of a player\'s game. The quote "you are the shittest fucking referee I have ever seen" came out of the mouth of a player — in a game we were in the ascendancy, ready to take a vital point which ultimately would have won us the league. Impossible with 10 men.',
    winner: 'Jack Hinch',
  },
  {
    type: 'joke',
    variant: 'slowest-race',
    category: 'Slowest in the Squad',
    description: "Sunday league isn't always about pace.",
    winner: slowestRaceWinner(SLOWEST_RACE_CONFIG).label,
    race: SLOWEST_RACE_CONFIG,
  },
];

export const seriousAwards: Award[] = [
  {
    type: 'serious',
    category: 'Clubman of the Year',
    description:
      'Awarded to the player who has gone above and beyond for the club this season. On and off the pitch, week in week out, without being asked.',
    winner: '',
  },
  {
    type: 'serious',
    category: 'Top Goalscorer',
    description:
      'Awarded to the player who led the club goalscoring chart across the 2025/26 season.',
    winner: '',
  },
  {
    type: 'serious',
    category: "Players' Player",
    description:
      'Chosen by the squad. The one your teammates want alongside them every Sunday morning.',
    winner: '',
  },
  {
    type: 'serious',
    category: 'Player of the Year',
    description:
      'The standout performer of the 2025/26 season. Consistent, influential, and the first name on the teamsheet.',
    winner: '',
  },
  {
    type: 'serious',
    category: 'Goal of the Season',
    description:
      'One moment that had everyone off their feet. The best goal Bishop Middleham FC scored all season.',
    winner: '',
  },
];

/** Default order (jokes first); use `composeAwards` for flow-specific order. */
export const awards: Award[] = [...jokeAwards, ...seriousAwards];

export { slideshowImages } from './slideshowImages';

export const introConfig = {
  title: 'Welcome to the 2025/26 Awards Night',
  /** One presentation screen per paragraph (title shown on each). */
  paragraphs: [
    'A warm welcome to our end of season awards ceremony.',
    'The 25/26 season was certainly a positive one and the best performance on the pitch the club has produced in recent years. With the possibility of promotion depending on the restructuring of the divisions.',
    'Bishop Middleham FC is in a strong position to build and improve going into the new season.',
    'We hope you enjoy celebrating all your efforts from the previous campaign and look forward to seeing you next season.',
  ],
};

export const INTRO_SCREEN_COUNT = introConfig.paragraphs.length;
