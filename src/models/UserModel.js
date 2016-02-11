const security = {
  CAN_MANAGETEAM: 'CAN_MANAGETEAM'
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

  can(what) {
    return this._security.indexOf(what) !== -1;
  }

  canManageTeams(teamId) {
    return this.playsIn(teamId) || this.can(security.CAN_MANAGETEAM);
  }
}