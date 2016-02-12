import { util as storeUtils} from '../store.js';

import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';

import PlayerModel from './PlayerModel.js';
import MatchReportModel from './MatchReportModel.js';
import { OwnClubId } from './ClubModel.js';

export var matchOutcome = keyMirror({
  NotYetPlayed: '',
  Won: '',
  Lost: '',
  Draw: '',
  WalkOver: '',
});


export default class MatchModel {
  constructor(json) {
    this.id = json.id;
    this.isHomeMatch = json.isHomeMatch;
    this.frenoyMatchId = json.frenoyMatchId;
    this.teamId = json.teamId;
    this.week = json.week;
    this.opponent = json.opponent;
    this.date = moment(json.date);

    this.report = new MatchReportModel(json.report);
    this.isDerby = this.opponent.clubId === OwnClubId;
  }

  getDisplayDate() {
    if (this.date.minutes()) {
      return this.date.format('ddd D/M HH:mm');
    }
    return this.date.format('ddd D/M HH');
  }

  getOpponentClub() {
    return storeUtils.getClub(this.opponent.clubId);
  }

  getOpponentDesc() {
    var club = storeUtils.getClub(this.opponent.clubId);
    return `${club.name} ${this.opponent.teamCode}`;
  }

  getTeamDesc() {
    var team = storeUtils.getTeam(this.teamId);
    return `${team.competition} ${team.teamCode}`;
  }

  getTeam() {
    return storeUtils.getTeam(this.teamId);
  }

  plays(playerId) {
    if (playerId instanceof PlayerModel) {
      playerId = playerId.id;
    }
    return this.report.players.some(ply => ply.playerId === playerId);
  }
}