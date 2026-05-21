const BMFC = 'Bishop Middleham FC';

export interface SeasonMatch {
  date: string;
  home: string;
  score: string;
  away: string;
  competition: string;
}

export const seasonMatches: SeasonMatch[] = [
  { date: '10/08/2025', home: BMFC, score: '2–2 (L 2-3 pens)', away: 'Bowburn Sports and Social FC', competition: 'Alan Smith Memorial Trophy R1' },
  { date: '12/08/2025', home: BMFC, score: '3–4', away: 'Newton Aycliffe Iron Horse', competition: 'Third Division' },
  { date: '17/08/2025', home: BMFC, score: '1–5', away: 'Witton Park Rose and Crown FC', competition: 'League Cup R2' },
  { date: '19/08/2025', home: 'Dubmire WMC FC', score: '3–1', away: BMFC, competition: 'Third Division' },
  { date: '24/08/2025', home: 'New Brancepeth WMC FC', score: '3–0', away: BMFC, competition: 'Challenge Trophy R2' },
  { date: '26/08/2025', home: BMFC, score: '2–0', away: 'Langley Park FC', competition: 'Third Division' },
  { date: '31/08/2025', home: 'Castleside Club FC', score: '0–13', away: BMFC, competition: 'Third Division' },
  { date: '07/09/2025', home: 'Chilton Club FC', score: '1–1 (W 4-1 pens)', away: BMFC, competition: 'Presidents Trophy R1' },
  { date: '14/09/2025', home: BMFC, score: '5–2', away: 'Ferryhill The Ivorson FC', competition: 'Third Division' },
  { date: '21/09/2025', home: BMFC, score: '7–1', away: 'Ferryhill Miners United', competition: 'Third Division' },
  { date: '12/10/2025', home: BMFC, score: '20–1', away: 'Castleside Club FC', competition: 'Third Division' },
  { date: '19/10/2025', home: BMFC, score: '5–1', away: 'Bede Lodge Social Club FC', competition: 'Knock Out Cup R2' },
  { date: '26/10/2025', home: BMFC, score: '2–1', away: 'Kirk Merrington Half Moon', competition: 'Third Division' },
  { date: '02/11/2025', home: BMFC, score: '3–3', away: 'Newton Aycliffe Iron Horse', competition: 'Third Division' },
  { date: '23/11/2025', home: 'North Bitchburn', score: 'P–P', away: BMFC, competition: 'Third Division' },
  { date: '30/11/2025', home: 'Waldridge FC', score: '6–1', away: BMFC, competition: 'Knock Out Cup R3' },
  { date: '07/12/2025', home: 'Langley Park FC', score: '3–0', away: BMFC, competition: 'Third Division' },
  { date: '04/01/2026', home: 'Newton Aycliffe Iron Horse', score: 'P–P', away: BMFC, competition: 'Third Division' },
  { date: '11/01/2026', home: 'Chilton Club FC', score: 'P–P', away: BMFC, competition: 'Third Division' },
  { date: '18/01/2026', home: 'Ferryhill The Ivorson FC', score: '0–5', away: BMFC, competition: 'Third Division' },
  { date: '25/01/2026', home: 'Kirk Merrington Half Moon', score: '3–4', away: BMFC, competition: 'Third Division' },
  { date: '01/02/2026', home: BMFC, score: '3–1', away: 'Dubmire WMC FC', competition: 'Third Division' },
  { date: '08/02/2026', home: 'North Bitchburn', score: 'P–P', away: BMFC, competition: 'Third Division' },
  { date: '15/02/2026', home: 'Willington Commercial FC', score: 'P–P', away: BMFC, competition: 'Third Division' },
  { date: '22/02/2026', home: 'North Bitchburn', score: 'P–P', away: BMFC, competition: 'Third Division' },
  { date: '01/03/2026', home: BMFC, score: '2–1', away: 'Willington Commercial FC', competition: 'Third Division' },
  { date: '08/03/2026', home: 'Craghead Legion', score: '4–5', away: BMFC, competition: 'Third Division' },
  { date: '15/03/2026', home: 'North Bitchburn', score: '3–2', away: BMFC, competition: 'Third Division' },
  { date: '29/03/2026', home: 'Ferryhill Miners United', score: '0–13', away: BMFC, competition: 'Third Division' },
  { date: '31/03/2026', home: 'Chilton Club FC', score: '0–2', away: BMFC, competition: 'Third Division' },
  { date: '07/04/2026', home: BMFC, score: '2–3', away: 'North Bitchburn', competition: 'Third Division' },
  { date: '12/04/2026', home: BMFC, score: '3–1', away: 'Craghead Legion', competition: 'Third Division' },
  { date: '19/04/2026', home: 'Willington Commercial FC', score: '1–2', away: BMFC, competition: 'Third Division' },
  { date: '21/04/2026', home: BMFC, score: '4–1', away: 'Chilton Club FC', competition: 'Third Division' },
];

export const topScorers: { player: string; goals: number }[] = [
  { player: 'Lee Hutchinson', goals: 31 },
  { player: 'Carl Hodges', goals: 22 },
  { player: 'Jack Marley', goals: 14 },
  { player: 'David Redfern', goals: 11 },
  { player: 'Sam Marshall', goals: 7 },
  { player: 'Jordan Stannard', goals: 4 },
];

function parseBmfcResult(home: string, score: string, away: string) {
  if (/P[–-]P/i.test(score)) return null;

  const isHome = home === BMFC;
  const isAway = away === BMFC;
  if (!isHome && !isAway) return null;

  const scoreMain = score.split('(')[0].trim();
  const parts = scoreMain.split(/[–-]/).map((s) => parseInt(s.trim(), 10));
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null;

  const [homeGoals, awayGoals] = parts;
  const bmfcGoals = isHome ? homeGoals : awayGoals;
  const oppGoals = isHome ? awayGoals : homeGoals;
  const opponent = isHome ? away : home;

  const pen = score.match(/\(([WDL])\s/);
  let result: 'W' | 'D' | 'L';
  if (pen) {
    result = pen[1] as 'W' | 'D' | 'L';
  } else if (bmfcGoals > oppGoals) {
    result = 'W';
  } else if (bmfcGoals < oppGoals) {
    result = 'L';
  } else {
    result = 'D';
  }

  return { bmfcGoals, oppGoals, result, opponent };
}

export const seasonStats = (() => {
  let played = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let biggestWin = { score: '', opponent: '', margin: 0 };

  for (const m of seasonMatches) {
    const parsed = parseBmfcResult(m.home, m.score, m.away);
    if (!parsed) continue;

    played++;
    goalsFor += parsed.bmfcGoals;
    goalsAgainst += parsed.oppGoals;

    if (parsed.result === 'W') wins++;
    else if (parsed.result === 'D') draws++;
    else losses++;

    if (parsed.result === 'W') {
      const margin = parsed.bmfcGoals - parsed.oppGoals;
      if (margin > biggestWin.margin) {
        biggestWin = {
          score: `${parsed.bmfcGoals}–${parsed.oppGoals}`,
          opponent: parsed.opponent,
          margin,
        };
      }
    }
  }

  const goalDifference = goalsFor - goalsAgainst;

  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,
    biggestWin,
  };
})();

export type SeasonSlide =
  | { type: 'title'; title: string; subtitle?: string }
  | { type: 'stats'; title: string; items: { label: string; value: string }[] }
  | { type: 'league-journey'; title: string; phase: 'table' | 'climb' }
  | { type: 'scorers'; title: string; rows: { player: string; goals: number }[] }
  | { type: 'highlights'; title: string; lines: string[] }
  | { type: 'section-intro'; title: string; lines?: string[] };

export const seasonSlides: SeasonSlide[] = [
  {
    type: 'title',
    title: '2025/26 Season',
    subtitle: 'Bishop Middleham FC — all competitions',
  },
  {
    type: 'stats',
    title: 'Season Record',
    items: [
      { label: 'Played', value: String(seasonStats.played) },
      { label: 'Won', value: String(seasonStats.wins) },
      { label: 'Drawn', value: String(seasonStats.draws) },
      { label: 'Lost', value: String(seasonStats.losses) },
      { label: 'Goals for', value: String(seasonStats.goalsFor) },
      { label: 'Goals against', value: String(seasonStats.goalsAgainst) },
      { label: 'Goal difference', value: `${seasonStats.goalDifference >= 0 ? '+' : ''}${seasonStats.goalDifference}` },
    ],
  },
  {
    type: 'league-journey',
    title: 'Moving Up The Division',
    phase: 'table',
  },
  {
    type: 'league-journey',
    title: 'Moving Up The Division',
    phase: 'climb',
  },
  {
    type: 'scorers',
    title: 'Top Goalscorers',
    rows: topScorers,
  },
  {
    type: 'highlights',
    title: 'Season Highlights',
    lines: [
      `Biggest win: ${seasonStats.biggestWin.score} vs ${seasonStats.biggestWin.opponent}`,
      `${topScorers[0].player} — ${topScorers[0].goals} goals`,
      `${seasonStats.goalsFor} goals scored across ${seasonStats.played} matches`,
      `${seasonStats.wins} victories in all competitions`,
    ],
  },
  {
    type: 'section-intro',
    title: '2025/26 Awards',
  },
];

export const SEASON_SLIDE_COUNT = seasonSlides.length;
