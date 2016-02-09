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

    this._isHomeMatch = isHomeMatch;
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

  getOwnPlayers() {
    return this.players.filter(player => this.homeFilter(player.home)).sort((a, b) => a.position - b.position);
  }
  getTheirPlayers() {
    return this.players.filter(player => !this.homeFilter(player.home)).sort((a, b) => a.position - b.position);
  }

  getGamePlayer(uniqueIndex) {
    return this.players.find(ply => ply.uniqueIndex === uniqueIndex);
  }

  getGameMatches() {
    if (!this.games.length) {
      return null;
    }

    return this.games.map(game => {
      var result = {
        matchNumber: game.matchNumber,
        home: this.getGamePlayer(game.homePlayerUniqueIndex),
        out: this.getGamePlayer(game.outPlayerUniqueIndex),
        sets: `${game.homePlayerSets}-${game.outPlayerSets}`
      };

      result.outcome = game.homePlayerSets > game.outPlayerSets ? matchOutcome.Won : matchOutcome.Lost;
      if (!this._isHomeMatch) {
        result.outcome = result.outcome === matchOutcome.Won ? matchOutcome.Lost : matchOutcome.Won;
      }
      return result;
    });
  }
}