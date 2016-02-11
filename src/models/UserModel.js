const security = {
  CAN_MANAGETEAM: 'CAN_MANAGETEAM'
};

export default class UserModel {
  constructor(json) {
    this.playerId = json.playerId;
    this.teams = json.teams;
    this._security = json.security;
  }

  playsIn(reeksId) {
    return this.teams.indexOf(reeksId) !== -1;
  }

  can(what) {
    return this._security.indexOf(what) !== -1;
  }

  canManageTeams(reeksId) {
    return this.playsIn(reeksId) || this.can(security.CAN_MANAGETEAM);
  }
}