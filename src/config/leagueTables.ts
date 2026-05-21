export interface LeagueRow {
  position: number;
  club: string;
  p: number;
  w: number;
  d: number;
  l: number;
  f: number;
  a: number;
  gd: number;
  pts: number;
  deducted?: boolean;
}

export const leagueTable2425: LeagueRow[] = [
  { position: 1, club: 'Spennymoor Voltigeur FC', p: 22, w: 18, d: 1, l: 3, f: 87, a: 25, gd: 62, pts: 55 },
  { position: 2, club: 'Durham City Drunken Duck FC', p: 22, w: 17, d: 3, l: 2, f: 74, a: 23, gd: 51, pts: 54 },
  { position: 3, club: 'Newton Aycliffe Juniors FC', p: 22, w: 13, d: 2, l: 7, f: 85, a: 39, gd: 46, pts: 41 },
  { position: 4, club: 'Witton Gilbert WMC FC', p: 22, w: 12, d: 5, l: 5, f: 61, a: 39, gd: 22, pts: 41 },
  { position: 5, club: 'Bearpark Community Club FC', p: 22, w: 12, d: 4, l: 6, f: 63, a: 30, gd: 33, pts: 40 },
  { position: 6, club: 'Sacriston Colliery Cricket Club FC', p: 22, w: 9, d: 5, l: 8, f: 41, a: 39, gd: 2, pts: 32 },
  { position: 7, club: 'Bowburn Sports and Social FC', p: 22, w: 10, d: 4, l: 8, f: 52, a: 41, gd: 11, pts: 31, deducted: true },
  { position: 8, club: 'North Bitchburn', p: 22, w: 7, d: 3, l: 12, f: 39, a: 65, gd: -26, pts: 24 },
  { position: 9, club: 'Bishop Middleham FC', p: 22, w: 7, d: 3, l: 12, f: 47, a: 56, gd: -9, pts: 21, deducted: true },
  { position: 10, club: 'Dubmire WMC FC', p: 22, w: 6, d: 2, l: 14, f: 49, a: 71, gd: -22, pts: 17, deducted: true },
  { position: 11, club: 'Kirk Merrington Half Moon', p: 22, w: 2, d: 1, l: 19, f: 27, a: 104, gd: -77, pts: 7 },
  { position: 12, club: 'Willington Commercial FC', p: 22, w: 2, d: 1, l: 19, f: 16, a: 109, gd: -93, pts: 4, deducted: true },
];

export const leagueTable2526: LeagueRow[] = [
  { position: 1, club: 'Dubmire WMC FC', p: 22, w: 16, d: 2, l: 4, f: 87, a: 33, gd: 54, pts: 50 },
  { position: 2, club: 'Chilton Club FC', p: 22, w: 16, d: 1, l: 5, f: 111, a: 36, gd: 75, pts: 49 },
  { position: 3, club: 'Bishop Middleham FC', p: 22, w: 16, d: 1, l: 5, f: 103, a: 36, gd: 67, pts: 49 },
  { position: 4, club: 'Newton Aycliffe Iron Horse', p: 22, w: 14, d: 4, l: 4, f: 56, a: 31, gd: 25, pts: 46 },
  { position: 5, club: 'North Bitchburn', p: 22, w: 14, d: 3, l: 5, f: 83, a: 46, gd: 37, pts: 45 },
  { position: 6, club: 'Ferryhill The Ivorson FC', p: 22, w: 12, d: 1, l: 9, f: 50, a: 39, gd: 11, pts: 37 },
  { position: 7, club: 'Willington Commercial FC', p: 22, w: 8, d: 4, l: 10, f: 60, a: 53, gd: 7, pts: 28 },
  { position: 8, club: 'Kirk Merrington Half Moon', p: 22, w: 6, d: 6, l: 10, f: 56, a: 62, gd: -6, pts: 24 },
  { position: 9, club: 'Craghead Legion', p: 22, w: 6, d: 5, l: 11, f: 48, a: 76, gd: -28, pts: 23 },
  { position: 10, club: 'Langley Park FC', p: 22, w: 6, d: 3, l: 13, f: 29, a: 47, gd: -18, pts: 21 },
  { position: 11, club: 'Ferryhill Miners United', p: 22, w: 2, d: 2, l: 18, f: 35, a: 116, gd: -81, pts: 2, deducted: true },
  { position: 12, club: 'Castleside Club FC', p: 22, w: 0, d: 0, l: 22, f: 16, a: 159, gd: -143, pts: -3, deducted: true },
];

export const BMFC_CLUB = 'Bishop Middleham FC';

export function isBmfcRow(club: string) {
  return club === BMFC_CLUB;
}
