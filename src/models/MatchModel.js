import { util as storeUtils} from '../store.js';

import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';

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
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        this[prop] = json[prop];
      }
    }

    this.date = moment(this.date);
    this.isDerby = this.opponent.clubId === OwnClubId;

    this.report = new MatchReportModel(this.report, this.isHomeMatch);
  }

  getDisplayDate() {
    if (this.date.minutes()) {
      return this.date.format('ddd D/M HH:mm');
    }
    return this.date.format('ddd D/M HH');
  }

  getOpponentDesc() {
    var club = storeUtils.getClub(this.opponent.clubId);
    return `${club.name} ${this.opponent.teamCode}`;
  }

  getTeamDesc() {
    var team = storeUtils.getReeks(this.reeksId);
    return `${team.competition} ${team.teamCode}`;
  }

  getTeam() {
    return storeUtils.getReeks(this.reeksId);
  }
}