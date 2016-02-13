import Immutable from 'immutable';
import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';

import { util as storeUtils} from '../store.js';
import PlayerModel from './PlayerModel.js';
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
    // match
    this.id = json.id;
    this.isHomeMatch = json.isHomeMatch;
    this.frenoyMatchId = json.frenoyMatchId;
    this.teamId = json.teamId;
    this.week = json.week;
    this.opponent = json.opponent;
    this.date = moment(json.date);

    // verslag
    this.description = json.description;
    this.playerId = json.playerId;
    this.score = json.score;
    this.scoreType = json.scoreType;
    this.isPlayed = json.isPlayed;
    this.players = Immutable.List(json.players);
    this.games = Immutable.List(json.games);

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
    return this.players.some(ply => ply.playerId === playerId);
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
        if (!this.isHomeMatch) {
          result.outcome = result.outcome === matchOutcome.Won ? matchOutcome.Lost : matchOutcome.Won;
        }
      } else {
        result.outCome = matchOutcome.WalkOver;
      }

      return result;
    });
  }
}