import storeUtil from '../storeUtil.js';
import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';

export const userRoles = ['Player', 'Board', 'Dev', 'System'];

const security = keyMirror({
  CAN_MANAGETEAM: '',
  CAN_EDITALLREPORTS: '',
  IS_ADMIN: '',
  IS_DEV: '',
  IS_SYSTEM: '',
});

export default class UserModel {
  constructor(json) {
    this.playerId = json.playerId;
    this.teams = json.teams;
    this._security = json.security;
  }

  playsIn(teamId) {
    return this.teams.indexOf(teamId) !== -1;
  }

  getPlayer() {
    return storeUtil.getPlayer(this.playerId);
  }
  getTeams() {
    return this.teams.map(storeUtil.getTeam);
  }

  can(what) {
    return this._security.indexOf(what) !== -1;
  }

  canManageTeams() {
    return this.can(security.CAN_MANAGETEAM);
  }
  canEditMatchesOrIsCaptain() {
    if (this.can(security.CAN_MANAGETEAM)) {
      return true;
    }

    const captains = [].concat.apply([], this.getTeams().map(team => team.getCaptainPlayerIds()));
    return captains.indexOf(this.playerId) !== -1;
  }
  canEditMatchPlayers(match) {
    if (match.isSyncedWithFrenoy) {
      return false;
    }

    if (this.can(security.CAN_MANAGETEAM)) {
      return true;
    }

    const isCaptain = match.getTeam().isCaptain(this.getPlayer());
    if (!isCaptain) {
      return false;
    }

    if (match.block === 'Major') {
      return false;
    }

    return true;
  }
  canEditPlayersOnMatchDay(match) {
    return this.isAdmin() || this.playerId && match.date.isSame(moment(), 'day');
  }
  canPostReport(teamId) {
    return this.playsIn(teamId) || this.can(security.CAN_EDITALLREPORTS);
  }
  canChangeMatchScore(match) {
    if (match.isSyncedWithFrenoy) {
      return false;
    }
    return this.playsIn(match.teamId) || this.isAdmin() || match.players.find(p => p.playerId === this.playerId);
  }

  isAdmin() {
    return this.can(security.IS_ADMIN);
  }
  isDev() {
    return this.can(security.IS_DEV);
  }
  isSystem() {
    return this.can(security.IS_SYSTEM);
  }
}