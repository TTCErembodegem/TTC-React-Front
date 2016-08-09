import { util as storeUtils} from '../store.js';
import moment from 'moment';

export const teamPlayerType = {
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

class TeamFrenoyModel {
  constructor(frenoy, team) {
    this.divisionId = frenoy.divisionId;
    this.linkId = frenoy.linkId;
    this.teamId = frenoy.teamId;
    this.seasonId = team.year - 2000 + 1;

    this.team = team;
  }

  getUrl(type) {
    const season = this.seasonId;
    const linkId = this.linkId;
    if (this.team.competition === 'Vttl') {
      if (type === 'ranking') {
        return `http://competitie.vttl.be/index.php?menu=4&season=${season}&province=5&club_id=282&perteam=1&div_id=${linkId}`;
      } else if (type === 'results') {
        return `http://competitie.vttl.be/index.php?menu=5&season=${season}&div_id=${linkId}`;
      }
    } else if (this.team.competition === 'Sporta') {
      if (type === 'ranking') {
        return `http://tafeltennis.sporcrea.be/competitie/index.php?menu=4&season=${season}&province=4&club_id=37&perteam=1&div_id=${linkId}`;
      } else if (type === 'results') {
        return `http://tafeltennis.sporcrea.be/competitie/index.php?menu=5&season=${season}&province=4&club_id=37&perteam=1&div_id=${linkId}`;
      }
    }
  }
}

export default class TeamModel {
  constructor(json) {
    this.competition = json.competition;
    this.divisionName = json.divisionName;
    this.id = json.id;
    this.teamCode = json.teamCode;
    this.clubId = json.clubId;
    this.year = json.year;
    this.opponents = json.opponents;
    this.players = json.players;
    this.ranking = json.ranking;
    this.frenoy = new TeamFrenoyModel(json.frenoy, this);
  }

  getTeamPlayerCount() {
    return this.competition === 'Vttl' ? 4 : 3;
  }
  getScoreCount() {
    return this.competition === 'Vttl' ? 16 : 10;
  }

  renderOwnTeamTitle() {
    return this.competition + ' ' + this.teamCode;
  }

  getDivisionRanking(opponent = 'our-ranking') {
    if (opponent === 'our-ranking') {
      return this.getDivisionRanking({clubId: this.clubId, teamCode: this.teamCode});
    }
    var result = this.ranking.find(x => x.clubId === opponent.clubId && x.teamCode === opponent.teamCode);
    return result || {};
  }
  getThriller(match) {
    if (match.date.isBefore(moment())) {
      return;
    }
    const ourRanking = this.getDivisionRanking();
    const theirRankingPosition = this.getDivisionRanking(match.opponent).position;
    const teamsInDivision = this.ranking.length;

    const gamesPlayed = ourRanking.gamesWon + ourRanking.gamesLost + ourRanking.gamesDraw;
    if (gamesPlayed < 5) {
      return;
    }

    if (ourRanking.position <= 3 && theirRankingPosition <= 3) {
      return 'topMatch';
    } else if (ourRanking.position >= teamsInDivision - 2 && theirRankingPosition >= teamsInDivision - 2) {
      return 'degradationMatch';
    }
    return;
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

  getMatches() {
    return storeUtils.matches.getAllMatches()
      .filter(match => match.teamId === this.id);
  }

  isTopper() {
    return this.getDivisionRanking().position < 3;
  }
  isInDegradationZone() {
    return this.getDivisionRanking().position >= (this.ranking.length - 2);
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