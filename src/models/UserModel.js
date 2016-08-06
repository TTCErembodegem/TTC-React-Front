import { util as storeUtil } from '../store.js';
import keyMirror from 'fbjs/lib/keyMirror';

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

  can(what) {
    return this._security.indexOf(what) !== -1;
  }

  canManageTeam(teamId) {
    return this.playsIn(teamId) || this.can(security.CAN_MANAGETEAM);
  }
  canPostReport(teamId) {
    return this.playsIn(teamId) || this.can(security.CAN_EDITALLREPORTS);
  }
  canChangeMatchScore(match) {
    if (match.scoreType !== 'BeingPlayed') {
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