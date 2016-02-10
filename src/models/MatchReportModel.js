import { matchOutcome } from './MatchModel.js';

function getFirstName(fullName) {
  if (fullName.indexOf(' ') === -1) {
    return fullName;
  }
  return fullName.substr(0, fullName.indexOf(' '));
}

export default class MatchReportModel {
  constructor(json, isHomeMatch) {
    for (let prop in json) {
      if (json.hasOwnProperty(prop)) {
        this[prop] = json[prop];
      }
    }

    this.isPlayed = this.scoreType && this.scoreType !== matchOutcome.NotYetPlayed && this.scoreType !== matchOutcome.WalkOver;
    //this.hasExtendedInfo = !!(this.players.length || this.description || false);

    this._isHomeMatch = isHomeMatch;
    this._fixPlayerNameCollisions();
    this._fixHomeProp();
  }

  _isOwnClubPlayer(isHomePlayer) {
    return (this._isHomeMatch && isHomePlayer) || (!this._isHomeMatch && !isHomePlayer);
  }
  _fixPlayerNameCollisions() {
    // Fix in case two people are called 'Dirk' etc
    this.players.forEach(ply => {
      ply.nameShort = getFirstName(ply.name);
    });
    this.players.forEach(ply => {
      var otherPlayers = this.players.filter(otherPly => ply.position !== otherPly.position);
      if (otherPlayers.find(otherPly => getFirstName(otherPly.nameShort) === ply.nameShort)) {
        ply.nameShort += ply.name.substr(ply.name.indexOf(' '));
      }
    });
  }
  _fixHomeProp() {
    // Change the meaning of 'home' from 'was the player playing in his own club'
    // to 'is the player a member of TTC Erembodegem'
    this.players.forEach(ply => {
      ply.home = this._isOwnClubPlayer(ply.home);
    });
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
    if (!this.games.length) {
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
      result.outcome = game.homePlayerSets > game.outPlayerSets ? matchOutcome.Won : matchOutcome.Lost;
      if (!this._isHomeMatch) {
        result.outcome = result.outcome === matchOutcome.Won ? matchOutcome.Lost : matchOutcome.Won;
      }
      return result;
    });
  }
}