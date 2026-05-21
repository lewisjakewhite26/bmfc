import {
  interludeScreenCount,
  interludesBeforeAward,
  type TransitionSlide,
} from './transitions';

export type AwardType = 'joke' | 'serious';

export interface Award {
  category: string;
  description: string;
  winner: string;
  type: AwardType;
}

export const seasonLabel = '2025 · 26';

/** Joke: title (+ season) → description → winner */
export const SCREENS_PER_JOKE_AWARD = 3;
/** Serious: category (+ season) → award description (no name reveal) */
export const SCREENS_PER_SERIOUS_AWARD = 2;

export function screensPerAward(award: Award): number {
  return award.type === 'joke' ? SCREENS_PER_JOKE_AWARD : SCREENS_PER_SERIOUS_AWARD;
}

export function totalAwardScreens(awardList: Award[] = awards): number {
  return (
    interludeScreenCount() +
    awardList.reduce((sum, award) => sum + screensPerAward(award), 0)
  );
}

export type AwardSectionScreen =
  | { kind: 'interlude'; slide: TransitionSlide }
  | { kind: 'award'; awardIndex: number; awardStep: number };

export function resolveAwardSectionScreen(
  screenIndex: number,
  awardStart: number,
  awardList: Award[] = awards,
): AwardSectionScreen | null {
  let offset = screenIndex - awardStart;

  for (let i = 0; i < awardList.length; i++) {
    const interlude = interludesBeforeAward[i];
    if (interlude) {
      if (offset === 0) {
        return { kind: 'interlude', slide: interlude };
      }
      offset -= 1;
    }

    const steps = screensPerAward(awardList[i]);
    if (offset < steps) {
      return { kind: 'award', awardIndex: i, awardStep: offset };
    }
    offset -= steps;
  }

  return null;
}

export const awards: Award[] = [
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
    category: "The Please Don't Retire Award",
    description:
      'This person has been a tremendous presence in our team over the last few seasons. Unfortunately he has been having thoughts that he may be getting a bit too old for Sunday league football. He is wrong.',
    winner: 'Simon Darwin',
  },
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
