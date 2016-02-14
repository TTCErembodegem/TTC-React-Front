import { util as storeUtils} from '../store.js';

export function getPlayersPerTeam(competition) {
  return competition === 'Vttl' ? 4 : 3;
}

const teamPlayerType = {
  standard: 'Standard',
  captain: 'Captain',
  reserve: 'Reserve',
};

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

  getPlayers(type) {
    var players = this.players;
    if (type === 'reserve') {
      players = players.filter(ply => ply.type === teamPlayerType.reserve);
    } else if (type === 'standard') {
      players = players.filter(ply => ply.type !== teamPlayerType.reserve);
    }

    players = players.map(ply => ({
      player: storeUtils.getPlayer(ply.playerId),
      type: ply.type
    }));

    return players;
    //return players.sort((a, b) => a.player.getCompetition(this.competition).ranking - b.player.getCompetition(this.competition).ranking);
    // TODO: sort on position of competition
  }
}