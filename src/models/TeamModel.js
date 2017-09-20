import storeUtil from '../storeUtil.js';
import moment from 'moment';

export const teamPlayerType = {
  standard: 'Standard',
  captain: 'Captain',
  reserve: 'Reserve',
};


export default class TeamModel {
  constructor(json) {
    this.competition = json.competition; // 'Sporta' or 'Vttl'
    this.divisionName = json.divisionName;
    this.id = json.id;
    this.teamCode = json.teamCode;
    this.clubId = json.clubId;
    this.year = json.year;
    this.opponents = json.opponents; // : {teamCode: A-Z, clubId: number}[]
    this.players = json.players; // : {playerId: number, type: teamPlayerType}[]
    this.ranking = json.ranking; // : {clubId, teamCode, isForfait, position, points, gamesWon, gamesDraw, gamesLost}[]
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

  getDivisionDescription() {
    // TODO: put in translations
    if (!this.divisionName) {
      return 'Ere Afdeling';
    }
    return 'Prov ' + this.divisionName;
  }
  getDivisionRanking(opponent = 'our-ranking') {
    if (opponent === 'our-ranking') {
      return this.getDivisionRanking({clubId: this.clubId, teamCode: this.teamCode});
    }
    const result = this.ranking.find(x => x.clubId === opponent.clubId && x.teamCode === opponent.teamCode);
    return result || {empty: true};
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

  isCaptain(player) {
    return this.players.find(x => x.type === teamPlayerType.captain && x.playerId === player.id);
  }
  getCaptainPlayerIds() {
    return this.players.filter(x => x.type === teamPlayerType.captain).map(x => x.playerId);
  }

  getPlayers(type) {
    var players = this.players;
    if (type === 'reserve') {
      players = players.filter(ply => ply.type === teamPlayerType.reserve);
    } else if (type === 'standard') {
      players = players.filter(ply => ply.type !== teamPlayerType.reserve);
    }

    players = players.map(ply => ({
      player: storeUtil.getPlayer(ply.playerId),
      type: ply.type
    }));

    return players.sort(sortMappedPlayers(this.competition));
  }
  plays(playerId) {
    return this.players.find(ply => ply.playerId === playerId);
  }

  getMatches() {
    return storeUtil.matches.getAllMatches()
      .filter(match => match.teamId === this.id);
  }
  getPlayerStats() {
    const matches = this.getMatches().filter(m => m.isSyncedWithFrenoy);
    return getPlayerStats(matches);
  }

  isTopper() {
    return this.getDivisionRanking().position < 3;
  }
  isInDegradationZone() {
    return this.getDivisionRanking().position >= (this.ranking.length - 2);
  }
}

export function getPlayerStats(matches) {
  var result = {};
  matches.forEach(match => {
    const gameResults = match.getGameMatches();
    const homeOrOut = match.isHomeMatch ? 'home' : 'out';

    gameResults.forEach(game => {
      const playerId = game.ownPlayer.playerId || 0;
      const isDoubles = !playerId;

      if (!result[playerId]) {
        result[playerId] = {
          ply: storeUtil.getPlayer(playerId) || {},
          won: {},
          lost: {},
          games: 0,
          victories: 0,
          isDoubles: isDoubles,
        };
      }

      const playerResult = result[playerId];
      playerResult.games++;
      if (game.outcome === 'Won') {
        playerResult.victories++;
      }

      if (!isDoubles) {
        const otherPlayer = game[!match.isHomeMatch ? 'home' : 'out'];
        if (game.outcome === 'Won') {
          if (!playerResult.won[otherPlayer.ranking]) {
            playerResult.won[otherPlayer.ranking] = 0;
          }
          playerResult.won[otherPlayer.ranking]++;
        } else {
          if (!playerResult.lost[otherPlayer.ranking]) {
            playerResult.lost[otherPlayer.ranking] = 0;
          }
          playerResult.lost[otherPlayer.ranking]++;
        }
      }
    });
  });

  return Object.keys(result).map(key => result[key]);
}


class TeamFrenoyModel {
  constructor(frenoy, team) {
    this.divisionId = frenoy.divisionId;
    this.linkId = frenoy.linkId;
    this.teamId = frenoy.teamId;
    this.seasonId = team.year - 2000 + 1;

    this.teamCompetition = team.competition;
  }

  getUrl(type) {
    const season = this.seasonId;
    const linkId = this.linkId;
    if (this.teamCompetition === 'Vttl') {
      if (type === 'results') {
        return `https://competitie.vttl.be/index.php?menu=4&season=${season}&province=5&club_id=282&perteam=1&div_id=${linkId}`;
      } else if (type === 'ranking') {
        return `https://competitie.vttl.be/index.php?menu=5&season=${season}&div_id=${linkId}`;
      }
    } else if (this.teamCompetition === 'Sporta') {
      if (type === 'results') {
        return `https://ttonline.sporta.be/competitie/index.php?menu=4&season=${season}&province=4&club_id=37&perteam=1&div_id=${linkId}`;
      } else if (type === 'ranking') {
        return `https://ttonline.sporta.be/competitie/index.php?menu=5&season=${season}&province=4&club_id=37&perteam=1&div_id=${linkId}`;
      }
    }
  }
}



export function sortPlayers(competition) {
  // TODO: TeamModel.sortPlayers not in use?
  return (plyA, plyB) => {
    const aComp = plyA.getCompetition(competition);
    const bComp = plyB.getCompetition(competition);
    if (!aComp) {
      return -1;
    }
    if (!bComp) {
      return 1;
    }
    return aComp.position - bComp.position;
  };
}

export function sortMappedPlayers(competition) {
  return (plyA, plyB) => {
    const aComp = plyA.player.getCompetition(competition);
    const bComp = plyB.player.getCompetition(competition);
    if (!aComp) {
      return -1;
    }
    if (!bComp) {
      return 1;
    }

    if (plyA.type === plyB.type) {
      return aComp.position - bComp.position;
    }

    if (plyA.type === teamPlayerType.captain || plyB.type === teamPlayerType.reserve) {
      return -1;
    }
    if (plyB.type === teamPlayerType.captain || plyA.type === teamPlayerType.reserve) {
      return 1;
    }
    return aComp.position - bComp.position;
  };
}
