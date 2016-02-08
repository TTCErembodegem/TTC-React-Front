import store from '../store.js';

import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';
import _ from 'lodash';

export default class Match {
  constructor(json) {
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        this[prop] = json[prop];
      }
    }

    this.date = moment(this.date);
    if (this.report) {
      this.report = new MatchReport(this.report);
    }
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

export var matchOutcome = keyMirror({
  NotYetPlayed: '',
  Won: '',
  Lost: '',
  Draw: '',
  WalkOver: '',
});

export class MatchReport {
  constructor(json) {
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        this[prop] = json[prop];
      }
    }

    this.isPlayed = this.scoreType !== matchOutcome.NotYetPlayed && this.scoreType !== matchOutcome.WalkOver;
  }

  getScore() {
    if (!this.isPlayed) {
      return;
    }
    return this.score.home + ' - ' + this.score.out;
  }
}