import { util as storeUtils} from '../store.js';

const teamPlayerType = {
  standard: 'Standard',
  captain: 'Captain',
  reserve: 'Reserve',
};

function sortMappedPlayers(competition) {
  return (plyA, plyB) => {
    var aComp = plyA.player.getCompetition(competition);
    var bComp = plyB.player.getCompetition(competition);
    if (!aComp) {
      return -1;
    }
    if (!bComp) {
      return 1;
    }
    return aComp.position - bComp.position;
  };
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

  getTeamPlayerCount() {
    return this.competition === 'Vttl' ? 4 : 3;
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

    return players.sort(sortMappedPlayers(this.competition));
  }
}

export function sortPlayers(competition) {
  return (plyA, plyB) => {
    var aComp = plyA.getCompetition(competition);
    var bComp = plyB.getCompetition(competition);
    if (!aComp) {
      return -1;
    }
    if (!bComp) {
      return 1;
    }
    return aComp.position - bComp.position;
  };
}