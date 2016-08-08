import Immutable from 'immutable';
import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';

import store, { util as storeUtils} from '../store.js';
import PlayerModel from './PlayerModel.js';
import { OwnClubId } from './ClubModel.js';
import { sortPlayers } from './TeamModel.js';

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
    this.frenoyMatchId = json.frenoyMatchId;
    this.isSyncedWithFrenoy = json.isSyncedWithFrenoy;
    this.week = json.week;
    this.competition = json.competition;
    this.date = moment(json.date);

    this.score = json.score || {home: 0, out: 0};
    this.scoreType = json.scoreType; // NotYetPlayed, Won, Lost, Draw, WalkOver, BeingPlayed
    this.isPlayed = json.isPlayed;
    this.players = Immutable.List(json.players);
    this.games = Immutable.List(json.games);

    // TODO: probably better to split MatchModel and ReadOnlyMatchModel/OtherMatchModel
    if (json.opponent) {
      // TTC Erembodegem Match
      this.isHomeMatch = json.isHomeMatch;
      this.teamId = json.teamId;
      this.description = json.description;
      this.reportPlayerId = json.reportPlayerId;

      const comments = json.comments.map(c => ({
        ...c,
        postedOn: moment(c.postedOn)
      }));
      this.comments = Immutable.List(comments);

      this.opponent = json.opponent;
      this.isDerby = json.opponent.clubId === OwnClubId;
    } else {
      // OtherMatch
      this.home = json.home;
      this.away = json.away;
    }
  }

  getDisplayDate(format) {
    // Usage: this.context.t('match.date', match.getDisplayDate())
    if (format === 's') {
      return this.date.format('D/M');
    }
    if (format === 'd') {
      return this.date.format('ddd D/M');
    }

    if (this.date.minutes()) {
      return this.date.format('ddd D/M HH:mm');
    }
    return this.date.format('ddd D/M HH');
  }
  renderOpponentTitle() {
    const club = this.getOpponentClub();
    return club.name + ' ' + this.opponent.teamCode;
  }

  getOpponentClub() {
    if (this.home) {
      console.error('called getOpponentClub on OtherMatch'); // eslint-disable-line
    }
    return storeUtils.getClub(this.opponent.clubId) || {};
  }
  getClub(which) {
    if (this.opponent) {
      console.warn('MatchModel.getClub: use getOpponentClub for TTC Erembodegem matches'); // eslint-disable-line
    }
    if (which === 'home') {
      return storeUtils.getClub(this.home.clubId);
    }
    if (which === 'away') {
      return storeUtils.getClub(this.away.clubId);
    }
    console.error('MatchModel.getClub passed ' + which, 'expected home or away.'); // eslint-disable-line
  }

  won(opponent) {
    if (this.score.home === this.score.out) {
      return false;
    }

    var won = this.score.home > this.score.out;
    if (this.away.clubId === opponent.clubId && this.away.teamCode === opponent.teamCode) {
      won = !won;
    }
    return won;
  }
  isScoreComplete() {
    const scoreTotal = this.getTeam().getScoreCount();
    return this.score.home + this.score.out === scoreTotal;
  }
  renderScore() {
    if (this.score.home === 0 && this.score.out === 0) {
      return '';
    } else {
      return this.score.home + ' - ' + this.score.out;
    }
  }

  getTeam() {
    return storeUtils.getTeam(this.teamId);
  }

  plays(playerId) {
    if (playerId instanceof PlayerModel) {
      playerId = playerId.id;
    }
    return this.players.find(ply => ply.playerId === playerId);
  }

  getPreviousMatch() {
    var otherMatch = store.getState().matches
      .find(m => m.teamId === this.teamId &&
        m.opponent.clubId === this.opponent.clubId &&
        m.opponent.teamCode === this.opponent.teamCode &&
        m.date < this.date);

    return otherMatch;
  }

  getOwnPlayerModels() {
    var team = this.getTeam();
    return this.getOwnPlayers()
      .filter(ply => ply.status === 'Play')
      .filter(ply => ply.playerId) // ply.playerId===0 when someone played for Erembodegem that has incorrect competition details in speler table
      .map(ply => storeUtils.getPlayer(ply.playerId))
      .sort(sortPlayers(team.competition));
  }

  getOwnPlayers() {
    return this.players.filter(player => player.home).sort((a, b) => a.position - b.position);
  }
  getTheirPlayers() {
    return this.players.filter(player => !player.home).sort((a, b) => a.position - b.position);
  }

  getGamePlayer(uniqueIndex) {
    return this.players.find(ply => ply.uniqueIndex === uniqueIndex) || {};
  }

  getGameMatches() {
    if (!this.games.size) {
      return [];
    }

    return this.games.map(game => {
      var homePlayer = this.getGamePlayer(game.homePlayerUniqueIndex);
      var outPlayer = this.getGamePlayer(game.outPlayerUniqueIndex);
      var result = {
        matchNumber: game.matchNumber,
        home: homePlayer,
        out: outPlayer,
        homeSets: game.homePlayerSets,
        outSets: game.outPlayerSets,
        outcome: game.outcome,
      };

      if (result.home && result.out) {
        result.ownPlayer = result.home.playerId ? result.home : result.out;
      } else {
        result.ownPlayer = {};
      }
      return result;
    });
  }
}