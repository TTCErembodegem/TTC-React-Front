import store from '../store.js';

import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';
import _ from 'lodash';

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
    const clubs = store.getState().clubs;
    var club = _.find(clubs, x => x.id === this.opponent.clubId);
    return `${club.name} ${this.opponent.teamCode}`;
  }

  getTeamDesc() {
    const teams = store.getState().teams;
    var team = _.find(teams, x => x.reeksId === this.reeksId);
    return `${team.competition} ${team.teamCode}`;
  }
}