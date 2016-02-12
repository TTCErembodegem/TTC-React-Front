import Immutable from 'immutable';
import { matchOutcome } from './MatchModel.js';

export default class MatchReportModel {
  constructor(json) {
    this.description = json.description;
    this.playerId = json.playerId;
    this.score = json.score;
    this.scoreType = json.scoreType;
    this.isPlayed = json.isPlayed;

    this.players = Immutable.List(json.players);
    this.games = Immutable.List(json.games);
  }

  getScore() {
    if (!this.isPlayed) {
      return;
    }
    return this.score.home + ' - ' + this.score.out;
  }

  getOwnPlayers() {
    return this.players.filter(player => player.home).sort((a, b) => a.position - b.position);
  }
  getTheirPlayers() {
    return this.players.filter(player => !player.home).sort((a, b) => a.position - b.position);
  }

  getGamePlayer(uniqueIndex) {
    return this.players.find(ply => ply.uniqueIndex === uniqueIndex);
  }

  getGameMatches() {
    if (!this.games.size) {
      return null;
    }

    return this.games.map(game => {
      var result = {
        matchNumber: game.matchNumber,
        home: this.getGamePlayer(game.homePlayerUniqueIndex),
        out: this.getGamePlayer(game.outPlayerUniqueIndex),
        homeSets: game.homePlayerSets,
        outSets: game.outPlayerSets,
      };

      result.ownPlayer = result.home.playerId ? result.home : result.out;
      if (game.walkOver === 'None') {
        result.outcome = game.homePlayerSets > game.outPlayerSets ? matchOutcome.Won : matchOutcome.Lost;
        if (!this._isHomeMatch) {
          result.outcome = result.outcome === matchOutcome.Won ? matchOutcome.Lost : matchOutcome.Won;
        }
      } else {
        result.outCome = matchOutcome.WalkOver;
      }

      return result;
    });
  }
}