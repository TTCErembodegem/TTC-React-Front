import {getPlayerStats} from '../../../models/TeamModel.js';
import PlayerAchievements from './PlayerAchievements.js';
import {getRankingValue} from '../../../models/utils/playerRankingValueMapper';

export class AchievementsCalculator {
  constructor(players, matches, teams) {
    this.players = players;
    this.matches = matches.filter(x => x.isSyncedWithFrenoy).sort((a, b) => a.date.valueOf() - b.date.valueOf());
    this.teams = teams;
    this.playerStats = getPlayerStats(this.matches, true).filter(x => x.ply.id);

    const vttlMatches = this.matches.filter(m => m.competition === 'Vttl');
    this.vttlPlayerStats = getPlayerStats(vttlMatches, true).filter(x => x.ply.id);

    const sportaMatches = this.matches.filter(m => m.competition === 'Sporta');
    this.sportaplayerStats = getPlayerStats(sportaMatches, true).filter(x => !x.isDoubles).filter(x => x.ply.id);

    // this.sportaTeams = this.teams.filter(t => t.competition === 'Sporta');
    // this.vttlTeams = this.teams.filter(t => t.competition === 'Vttl');

    this.sportaMatches = this.matches.filter(t => t.competition === 'Sporta');
    this.vttlMatches = this.matches.filter(t => t.competition === 'Vttl');

    // console.log('matches', this.teams);
    console.log('yaye', this.vttlMatches);
  }

  getTopRankedTeams() {
    return this.teams.reduce((acc, cur) => {
      const ranking = cur.getDivisionRanking();
      if (ranking.position === 1) {
        acc.push(cur);
      }
      return acc;
    }, []);
  }

  getAchievements(type) {
    const {playerStats, matches} = this.getPlayerStats(type);
    if (playerStats.length !== 0) {
      return PlayerAchievements[type].reduce((acc, achievementGetter) => {
        acc = acc.concat(achievementGetter(playerStats, matches));
        return acc;
      }, []);
    }
    return [];
  }

  getNewRanking(competition) {
    const players = this.players
      .filter(player => player.getCompetition(competition))
      .map(player => {
        const result = {
          ply: player,
          old: player.getCompetition(competition).ranking,
          new: player.getCompetition(competition).nextRanking
        };
        result.oldValue = getRankingValue(competition, result.old);
        result.newValue = getRankingValue(competition, result.new);
        return result;
      })
      .filter(x => x.old && x.new && x.old !== x.new)
      .sort((a, b) => (a.oldValue - a.newValue) - (b.oldValue - b.newValue))
      .toArray();

    return players;
  }

  getPlayerStats(type) {
    switch (type) {
    case 'Vttl':
      return {playerStats: this.vttlPlayerStats, matches: this.vttlMatches};

    case 'Sporta':
      return {playerStats: this.sportaplayerStats, matches: this.sportaMatches};

    case 'belles':
    default:
      return {playerStats: this.playerStats, matches: this.matches};
    }
  }
}
