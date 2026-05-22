/**
 * Slowest-in-the-squad race — drop head PNGs into public/images/race/
 * Motion is driven by CSS keyframes per runner (see index.css), not finishMs alone.
 */
export interface RaceRunner {
  id: string;
  label: string;
  headSrc: string;
  /** When this runner crosses the line (ms from "go") — used for unlock timing */
  finishMs: number;
}

export interface SlowestRaceConfig {
  runners: RaceRunner[];
  /** Must match the runner with the largest finishMs */
  winnerId: string;
}

/** Full race animation length */
export const RACE_DURATION_MS = 30000;

export const SLOWEST_RACE_RUNNERS: RaceRunner[] = [
  { id: 'hunter', label: 'Hunter', headSrc: '/images/race/hunter.png', finishMs: 30000 },
  { id: 'parksy', label: 'Parksy', headSrc: '/images/race/parksy.png', finishMs: 28500 },
  { id: 'harvey', label: 'Harvey', headSrc: '/images/race/harvey.png', finishMs: 19500 },
  { id: 'sam', label: 'Sam', headSrc: '/images/race/sam.png', finishMs: 23400 },
  { id: 'cooksey', label: 'Cooksey', headSrc: '/images/race/cooksey.png', finishMs: 25800 },
];

export const SLOWEST_RACE_CONFIG: SlowestRaceConfig = {
  runners: SLOWEST_RACE_RUNNERS,
  winnerId: 'hunter',
};

export function slowestRaceWinner(config: SlowestRaceConfig): RaceRunner {
  return config.runners.reduce((slowest, r) =>
    r.finishMs > slowest.finishMs ? r : slowest,
  );
}
