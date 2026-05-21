export interface Award {
  category: string;
  description: string;
  winner: string;
}

export const seasonLabel = '2025 · 26';

/** Slides per award: title → description → title + season → winner */
export const SCREENS_PER_AWARD = 4;

export const awards: Award[] = [
  {
    category: 'TBC Joke Award',
    description:
      '[Placeholder] A light-hearted award — add the criteria and story behind this one before the evening.',
    winner: 'TBC',
  },
  {
    category: 'TBC Joke Award',
    description:
      '[Placeholder] A light-hearted award — add the criteria and story behind this one before the evening.',
    winner: 'TBC',
  },
  {
    category: 'TBC Joke Award',
    description:
      '[Placeholder] A light-hearted award — add the criteria and story behind this one before the evening.',
    winner: 'TBC',
  },
  {
    category: 'Clubman of the Year',
    description:
      '[Placeholder] Awarded to the player who has shown outstanding commitment, reliability, and service to Bishop Middleham FC throughout the season.',
    winner: 'TBC',
  },
  {
    category: 'Top Goalscorer',
    description:
      '[Placeholder] Awarded to the player who scored the most goals for the club during the 2025/26 campaign.',
    winner: 'Lee Hutchinson',
  },
  {
    category: "Players' Player",
    description:
      "[Placeholder] Voted for by the squad — awarded to the teammate most respected and valued by the players themselves.",
    winner: 'TBC',
  },
  {
    category: 'Player of the Year',
    description:
      '[Placeholder] Awarded to the player judged to have made the greatest overall contribution on and off the pitch this season.',
    winner: 'TBC',
  },
  {
    category: 'Goal of the Season',
    description:
      '[Placeholder] Awarded to the player responsible for the most memorable or outstanding goal of the 2025/26 season.',
    winner: 'TBC',
  },
];

export { slideshowImages } from './slideshowImages';

export const introConfig = {
  title: "Welcome to the 2025/26 Awards Night",
  summary: "A warm welcome to our end of season awards ceremony. The 25/26 season was certainly a positive one and the best performance on the pitch the club has produced in recent years. With the possibility of promotion depending on the restructuring of the divisions. Bishop Middleham FC is in a strong position to build and improve going into the new season. We hope you enjoy celebrating all your efforts from the previous campaign and look forward to seeing you next season."
};
