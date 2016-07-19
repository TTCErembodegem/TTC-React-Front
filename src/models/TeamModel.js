import { util as storeUtils} from '../store.js';
import { OwnClubId } from './ClubModel.js';

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
    this.clubId = json.clubId;
    this.year = json.year;
    this.frenoy = json.frenoy;
    this.opponents = json.opponents;
    this.players = json.players;
    this.ranking = json.ranking;
  }

  getTeamPlayerCount() {
    return this.competition === 'Vttl' ? 4 : 3;
  }
  getScoreCount() {
    return this.competition === 'Vttl' ? 16 : 10;
  }

  getDivisionRanking(opponent = 'our-ranking') {
    if (opponent === 'our-ranking') {
      return this.getDivisionRanking({clubId: this.clubId, teamCode: this.teamCode});
    }
    var result = this.ranking.find(x => x.clubId === opponent.clubId && x.teamCode === opponent.teamCode);
    return result || {};
  }
  getThriller(match) {
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

  isTopper(ranking,topThreshold) {
    return ranking <= topThreshold;
  }

  isInDegradationZone(ranking,bottomThreshold) {
    return ranking >= (this.ranking.length - bottomThreshold);
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