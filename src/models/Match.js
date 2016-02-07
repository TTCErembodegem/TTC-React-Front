import store from '../store.js';

import Moment from 'moment';
import _ from 'lodash';

export default class Match {
  constructor(json) {
    for (var prop in json) {
      this[prop] = json[prop];
    }

    this.date = Moment(this.date);
  };

  getOpponentDesc = function() {
    const clubs = store.getState().clubs;
    var club = _.find(clubs, x => x.id === this.opponent.clubId);
    return `${club.name} ${this.opponent.teamCode}`;
  };

  getTeamDesc = function() {
    const teams = store.getState().teams;
    var team = _.find(teams, x => x.reeksId == this.reeksId);
    return `${team.competition} ${team.teamCode}`;
  };
};