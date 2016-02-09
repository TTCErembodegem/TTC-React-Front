import { matchOutcome } from './MatchModel.js';

export default class MatchReportModel {
  constructor(json, isHomeMatch) {
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        this[prop] = json[prop];
      }
    }

    this.isPlayed = this.scoreType && this.scoreType !== matchOutcome.NotYetPlayed && this.scoreType !== matchOutcome.WalkOver;
    this.hasExtendedInfo = this.players.length || this.description || false;

    this.homeFilter = function(isHomePlayer) {
      return (isHomeMatch && isHomePlayer) || (!isHomeMatch && !isHomePlayer);
    };
  }

  getScore() {
    if (!this.isPlayed) {
      return;
    }
    return this.score.home + ' - ' + this.score.out;
  }

  getOwnClubPlayers() {
    if (!this.players.length) {
      return [];
    }

    return this.players.filter(player => this.homeFilter(player.home)).sort((a, b) => a.position - b.position);
  }
}