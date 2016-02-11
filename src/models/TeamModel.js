import { util as storeUtils} from '../store.js';

export function getPlayersPerTeam(competition) {
  return competition === 'Vttl' ? 4 : 3;
}

export default class TeamModel {
  constructor(json) {
    this.competition = json.competition;
    this.divisionName = json.divisionName;
    this.id = json.id;
    this.teamCode = json.teamCode;
    this.year = json.year;
    this.frenoy = json.frenoy;
    this.opponents = json.opponents;
    this.players = json.players;
  }

  getPlayers() {
    var result = this.players.map(ply => Object.assign({}, storeUtils.getPlayer(ply.playerId), {type: ply.type}));
    return result;
  }
}