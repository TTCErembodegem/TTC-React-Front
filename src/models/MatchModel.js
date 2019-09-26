import Immutable from 'immutable';
import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';

import storeUtil from '../storeUtil.js';
import PlayerModel from './PlayerModel.js';
import {OwnClubId} from './ClubModel.js';
import {sortMappedPlayers} from './TeamModel.js';

// TODO: Duplicted in backend. Should be in db.
const defaultStartHour = 20;

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
    this.shouldBePlayed = json.shouldBePlayed;
    this.isSyncedWithFrenoy = json.isSyncedWithFrenoy;
    this.week = json.week;
    this.competition = json.competition;
    this.frenoyDivisionId = json.frenoyDivisionId;
    this.date = moment(json.date);

    this.score = json.score || {home: 0, out: 0};
    this.scoreType = json.scoreType; // NotYetPlayed, Won, Lost, Draw, WalkOver, BeingPlayed
    this.isPlayed = json.isPlayed;
    this.players = Immutable.List(json.players);
    this.formationComment = json.formationComment;
    this.games = Immutable.List(json.games);

    // TODO: probably better to split MatchModel and ReadOnlyMatchModel/OtherMatchModel
    if (json.opponent) {
      // TTC Erembodegem Match
      this.isHomeMatch = json.isHomeMatch;
      this.teamId = json.teamId;
      this.description = json.description;
      this.reportPlayerId = json.reportPlayerId;
      this.block = json.block;

      const comments = json.comments.map(c => ({
        ...c,
        postedOn: moment(c.postedOn)
      }));
      this.comments = Immutable.List(comments);

      this.opponent = json.opponent; // teamCode, clubId
      this.isDerby = json.opponent.clubId === OwnClubId;
    } else {
      // OtherMatch
      this.home = json.home; // teamCode, clubId
      this.away = json.away;

      this.isOurMatch = this.home.clubId === OwnClubId || this.away.clubId === OwnClubId;
      if (this.isOurMatch) {
        this.getOurMatch = () => storeUtil.getMatch(this.id);
      }
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
  getDisplayTime() {
    if (this.date.minutes()) {
      return this.date.format('HH:mm');
    }
    return this.date.format('HH');
  }

  renderOpponentTitle() {
    const club = this.getOpponentClub();
    return club.name + ' ' + this.opponent.teamCode;
  }

  getOpponentClub() {
    if (this.home) {
      console.error('called getOpponentClub on OtherMatch'); // eslint-disable-line
    }
    return storeUtil.getClub(this.opponent.clubId) || {};
  }
  getClub(which) {
    if (this.opponent) {
      console.warn('MatchModel.getClub: use getOpponentClub for TTC Erembodegem matches'); // eslint-disable-line
    }
    if (which === 'home') {
      return storeUtil.getClub(this.home.clubId);
    }
    if (which === 'away') {
      return storeUtil.getClub(this.away.clubId);
    }
    console.error('MatchModel.getClub passed ' + which, 'expected home or away.'); // eslint-disable-line
  }

  isStandardStartTime() {
    return !this.date.minutes() && this.date.hours() === defaultStartHour;
  }
  isBeingPlayed() {
    const diff = moment.duration(moment().diff(this.date)).asHours();
    return Math.abs(diff) < 10;
  }
  won(opponent) {
    // ATTN: This only works for an OpponentMatch?
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
    return storeUtil.getTeam(this.teamId);
  }
  getTeamPlayerCount() {
    return this.competition === 'Vttl' ? 4 : 3;
  }

  getPreviousMatch() {
    var otherMatch = storeUtil.matches.getAllMatches()
      .find(m => m.teamId === this.teamId &&
        m.opponent.clubId === this.opponent.clubId &&
        m.opponent.teamCode === this.opponent.teamCode &&
        m.date < this.date);

    return otherMatch;
  }

  plays(playerId, statusFilter) {
    if (playerId instanceof PlayerModel) {
      playerId = playerId.id;
    }
    const playerInfo = this.getPlayerFormation(statusFilter).find(ply => ply.id === playerId);
    return playerInfo ? playerInfo.matchPlayer : undefined;
  }

  getPlayerFormation(statusFilter) {
    const team = this.getTeam();
    const plys = this.getOwnPlayers();

    var filter;
    if (!statusFilter || statusFilter === 'onlyFinal') {
      filter = ply => {
        const status = ply.matchPlayer.status;
        if (this.isSyncedWithFrenoy) {
          return status === 'Major';
        }

        if (this.block) {
          return status === this.block;
        }

        if (statusFilter === 'onlyFinal') {
          return false;
        }

        return status !== 'Major' && status !== 'Captain';
      };
    } else if (statusFilter === 'Play') {
      filter = ply => ply.matchPlayer.status !== 'Captain' && ply.matchPlayer.status !== 'Major';
    } else {
      filter = ply => ply.matchPlayer.status === statusFilter;
    }

    return plys.filter(ply => ply.playerId)
      .map(ply => ({
        id: ply.playerId,
        player: storeUtil.getPlayer(ply.playerId),
        matchPlayer: ply
      }))
      .filter(filter)
      .sort(sortMappedPlayers(team.competition));
  }

  getOwnPlayerModels(statusFilter) {
    return this.getPlayerFormation(statusFilter).map(x => x.player);
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
    // result.ownPlayer = {} == double game
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
        if (result.home.playerId || result.out.playerId) {
          result.ownPlayer = result.home.playerId ? result.home : result.out;
        } else {
          // readonlyMatch does not have ownPlayer

          // TODO: 2018: This is risky stuff. FrenoyApi changed and double matches don't seem to
          // be recognized properly anymore. Could use this to improve: it is now possible to fetch
          // who played in the doubles...
          // RISKY: Are readonlyMatches now a problem? (ie all readonlyMatches recognized as doubles match...)
          //         --> This didn't seem to be the case
          // console.log('FrenoyAPI change: Doubles vs readonlyMatches?', game, result);
          result.ownPlayer = {};
          result.isDoubles = false;
        }
      } else {
        // TODO: 2017: bug with isDoubles see backend TODO in FrenoyMatchesApi.cs
        // uhoh boy... morgen es checken hoe doubles match er in de db uitziet in 2017 en 2018?


        // debugger;
        result.ownPlayer = {};
        result.isDoubles = true;
      }
      return result;
    });
  }
}
