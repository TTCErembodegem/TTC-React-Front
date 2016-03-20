import { util as storeUtil } from '../store.js';

const security = {
  CAN_MANAGETEAM: 'CAN_MANAGETEAM',
  CAN_EDITALLREPORTS: 'CAN_EDITALLREPORTS',
  IS_ADMIN: 'IS_ADMIN',
  IS_DEV: 'IS_DEV',
};

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
  canChangeMatchScore(matchId) {
    return !!this.playerId;
  }

  isAdmin() {
    return this.can(security.IS_ADMIN);
  }
  isDev() {
    return this.can(security.IS_DEV);
  }
}