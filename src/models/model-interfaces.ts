/* eslint-disable no-use-before-define */
import {Moment} from 'moment';

export interface ITeamPlayerStats {
  // TODO interface ITeamPlayerStats
}


export interface IConfig {
  // TODO: interface IConfig
  [key: string]: any;
}

export type Historian = {
  push: Function;
}



/* ****************************************************
*                       UTILITY
**************************************************** */

export type Viewport = {
  width: number;
  height: number;
}

export type TabbedContainerEventKeyRouteProps = {
  match: {
    params: {
      tabKey: string,
    }
  }
}

type TranslatorFn = (key: string, params?: any) => string;

export type Translator = TranslatorFn & {
  reverseRoute: (baseRoute: string, translatedRoute: string) => string;
  route: (routeName: string, params?: any) => string;
  timeAgo(): any;
};

/* ****************************************************
*                       MATCHES
**************************************************** */

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

  getDisplayDate(format?: 's' | 'd'): string;
  getDisplayTime(): string;
  isStandardStartTime(): boolean;
  isBeingPlayed: () => boolean;
  getOwnPlayers(): IMatchPlayer[];
  getTheirPlayers(): IMatchPlayer[];
  renderScore(): string;
  getTeamPlayerCount: () => 4 | 3;
  getGamePlayer(uniqueIndex: number): IMatchPlayer | {};
}

/** If you are unsure what kind of match it is */
export interface IMatch extends IMatchCommon, IMatchOwn, IMatchOther {}

/** If you know it needs a TTC Aalst match, use this one */
export interface IFullMatchOwn extends IMatchCommon, IMatchOwn {}

/** If you know it needs a ReadonlyMatch, use this one */
export interface IFullMatcOther extends IMatchCommon, IMatchOther {}

/**
 * This interface applies only to MatchModels in which
 * one of the two teams is TTC Aalst
 * */
export interface IMatchOwn {
  isHomeMatch: boolean;
  teamId: number;
  description: string;
  reportPlayerId: 0 | number;
  block: 'Major' | string;
  comments: IMatchComment[];
  opponent: ITeamOpponent;
  isDerby: boolean;

  renderOpponentTitle(): string;
  getOpponentClub(): IClub | {};
  isScoreComplete(): boolean;
  getTeam: () => ITeam;
  getPreviousMatch(): IMatch | undefined;
  plays: (playerId: number | IPlayer, statusFilter?: 'onlyFinal') => IMatchPlayer | undefined;
  getPlayerFormation(statusFilter: undefined | 'onlyFinal' | 'Play' | 'Captain'): IMatchPlayerInfo[];
  getOwnPlayerModels(statusFilter: undefined | 'onlyFinal' | 'Play' | 'Captain'): IPlayer[];
  getGameMatches(): IGetGameMatches[];
}

/**
 * This interface applies only to MatchModels in which
 * TTC Aalst is not considered 'special' or is not playing in.
 * These are loaded in the context of other Teams.
 */
export interface IMatchOther {
  home: ITeamOpponent;
  away: ITeamOpponent;
  /** Is TTC Aalst home or away team? */
  isOurMatch: boolean;
  /** If isOurMatch, get the IMatchOwn MatchModel */
  getOurMatch: () => IMatch;

  getClub(which: "home" | "away"): IClub | undefined;
  won(opponent: ITeamOpponent): boolean;
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


export interface IGetGameMatches {
  matchNumber: number;
  home: {} | IMatchPlayer;
  out: {} | IMatchPlayer;
  homeSets: number;
  outSets: number;
  outcome: MatchGameOutcome;

  isDoubles: boolean;
  ownPlayer: {} | IPlayer;
}


export interface IMatchComment {
  id: number;
  matchId: number;
  playerId: number;
  text: string;
  /** Hidden is only visible for TTC Aalst players */
  hidden: boolean;
  postedOn: any;
  imageUrl: string;
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

  name: string;
  slug: string;
  getCompetition: (competition: Competition) => IPlayerCompetition | {};
  isMe(): boolean;
  getTeam(comp: Competition): ITeam;
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

  getTeamPlayerCount(): 3 | 4;
  getScoreCount(): 16 | 10;
  renderOwnTeamTitle(): string;
  getDivisionDescription(): string;
  getDivisionRanking(opponent?: 'our-ranking' | ITeamOpponent): ITeamRanking | {empty: true};
  getThriller(match: IMatch): undefined | 'topMatch' | 'degradationMatch';
  isCaptain: (player: IPlayer) => boolean;
  getCaptainPlayerIds: () => number[];
  getPlayers(type?: 'reserve' | 'standard'): ITeamPlayerInfo[];
  plays(playerId: number): boolean;
  getMatches(): IMatch[];
  getPlayerStats(): any[]; // TODO: still need strong typing
  isInDegradationZone(opponent: ITeamOpponent): boolean;
  isTopper(opponent: ITeamOpponent): boolean;
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

export interface IMatchPlayerInfo {
  id: number;
  player: IPlayer,
  matchPlayer: IMatchPlayer,
}

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
  contact: IPlayerContact;
  sortOrder: number;
}
