import {Moment} from 'moment';

/* ****************************************************
*                       MATCHES
**************************************************** */

//  const plys = players.map(ply => ({
//       player: storeUtil.getPlayer(ply.playerId),
//       type: ply.type,
//     }));

export type Competition = 'Vttl' | 'Sporta';

export type MatchScoreType = 'NotYetPlayed' | 'Won' | 'Lost' | 'Draw' | 'WalkOver' | 'BeingPlayed';

export type MatchPlayerStatus = 'Play' | 'Major' | 'Captain' | 'NotPlay' | 'Maybe';

export type MatchGameOutcome = 'NotYetPlayed' | 'Won' | 'Lost' | 'Draw' | 'WalkOver';

export interface IMatchScore {
  home: number;
  out: number;
}

export interface IMatchCommon {
  id: number;
  frenoyMatchId: string;
  shouldBePlayed: boolean;
  isSyncedWithFrenoy: boolean;
  week: number;
  competition: Competition;
  frenoyDivisionId: number;
  date: Moment;
  score: IMatchScore;
  scoreType: MatchScoreType;
  isPlayed: boolean;
  players: IMatchPlayer[];
  formationComment: string;
  games: IMatchGame[];
}

export interface IMatch extends IMatchCommon, IMatchOwn, IMatchOther {}

/**
 * This interface applies only to MatchModels in which
 * one of the two teams is TTC Erembodegem
 * */
export interface IMatchOwn {
  isHomeMatch: boolean;
  teamId: number;
  description: string;
  reportPlayerId: 0 | number;
  block: 'Major' | string;
  comments: any[];
  opponent: ITeamOpponent;
  isDerby: boolean;

  isBeingPlayed: () => boolean;
  getTeamPlayerCount: () => 4 | 3;
  getTeam: () => ITeam;
}

/**
 * This interface applies only to MatchModels in which
 * TTC Erembodegem is not considered 'special' or is not playing in.
 * These are loaded in the context of other Teams.
 */
export interface IMatchOther {
  home: ITeamOpponent;
  away: ITeamOpponent;
  /** Is TTC Erembodegem home or away team? */
  isOurMatch: boolean;
  /** If isOurMatch, get the IMatchOwn MatchModel */
  getOurMatch: () => IMatch;
}


export interface IMatchPlayer {
  id: number;
  matchId: number;
  status: MatchPlayerStatus;
  statusNote: string;
  position: number;
  name: string;
  ranking: string;
  uniqueIndex: number;
  won: number;
  home: boolean;
  playerId: 0 | number;
  alias: string;
}


export interface IMatchGame {
  id: number;
  matchId: number;
  matchNumber: number;
  homePlayerUniqueIndex: number;
  outPlayerUniqueIndex: number;
  homePlayerSets: number;
  outPlayerSets: number;
  outcome: MatchGameOutcome;
}



/* ****************************************************
*                       PLAYERS
**************************************************** */

export interface IPlayer {
  alias: string;
  contact: IPlayerContact;
  id: number;
  active: boolean;
  firstName: string;
  lastName: string;
  sporta?: IPlayerCompetition;
  vttl?: IPlayerCompetition;
  style: IPlayerStyle;
  quitYear: number;
  security: string | 'Player';
  hasKey: boolean;

  getCompetition: (competition: Competition) => IPlayerCompetition | {};
}

export interface IPlayerContact {
  playerId: number;
  email: string;
  mobile: string;
  address: string;
  city: string;
}

export interface IPlayerCompetition {
  clubId: number;
  competition: Competition;
  frenoyLink: string;
  /** Index */
  position: number;
  ranking: string;
  nextRanking: string | null;
  uniqueIndex: number;
  rankingIndex: number;
  rankingValue: number;
}

export interface IPlayerStyle {
  playerId: number;
  name: string;
  bestStroke: string;
}


/* ****************************************************
*                       TEAMS
**************************************************** */

export type TeamPlayerType = 'Standard' | 'Captain' | 'Reserve'; // TODO: lowercase or uppercase???

export const teamPlayerType = {
  standard: 'Standard',
  captain: 'Captain',
  reserve: 'Reserve',
};

export interface ITeam {
  competition: Competition;
  divisionName: string;
  id: number;
  teamCode: string;
  clubId: number;
  year: number;
  opponents: ITeamOpponent[];
  players: ITeamPlayer[];
  ranking: ITeamRanking[];
  frenoy: ITeamFrenoy;

  getCaptainPlayerIds: () => number[];
  isCaptain: (player: IPlayer) => boolean;
}

export interface ITeamOpponent {
  teamCode: string;
  clubId: number;
}

export interface ITeamPlayer {
  playerId: number;
  type: TeamPlayerType;
}

/** ITeamPlayer is with playerId, this one has it resolved to IPlayer */
export interface ITeamPlayerInfo {
  player: IPlayer;
  type: TeamPlayerType;
}

// export interface IMatchPlayerInfo {
//   id: number;
//   player: IPlayer,
//   matchPlayer: IMatchPlayer,
// }

export interface ITeamRanking {
  position: number;
  gamesWon: number;
  gamesLost: number;
  gamesDraw: number;
  points: number;
  clubId: number;
  teamCode: string;
  isForfait: boolean;
}

export interface ITeamFrenoy {
  divisionId: number;
  linkId: string;
  teamId: string;
  seasonId: number;
  teamCompetition: Competition;
}


/* ****************************************************
*                       CLUBS
**************************************************** */


export interface IClub {
  active: boolean;
  alternativeLocations: any[];
  codeSporta: string;
  codeVttl: string;
  id: number;
  name: string;
  shower: boolean;
  website: string;
  managers: IClubManager[];
  mainLocation: IClubLocation;
}

export interface IClubLocation {
  id: number;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  mobile: string;
}

export interface IClubManager {
  playerId: number;
  description: string;
  name: string;
  contact: IPlayerContact
}
