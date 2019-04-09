import {getPlayerStats} from '../../../models/TeamModel.js';
import PlayerAchievements from './PlayerAchievements.js';

export class AchievementsCalculator {
  constructor(players, matches, teams) {
    this.players = players;
    this.matches = matches;
    this.teams = teams;
    this.playerStats = getPlayerStats(this.matches, true);

    const vttlMatches = this.matches.filter(m => m.competition === 'Vttl');
    this.vttlPlayerStats = getPlayerStats(vttlMatches, true);

    const sportaMatches = this.matches.filter(m => m.competition === 'Sporta');
    this.sportaplayerStats = getPlayerStats(sportaMatches, true).filter(x => !x.isDoubles);

    this.sportaTeams = this.teams.filter(t => t.competition === 'Sporta');
    this.vttlTeams = this.teams.filter(t => t.competition === 'Vttl');

    console.log('matches', this.teams);
    console.log('yaye', this.teams);
  }

  getAchievements(type) {
    const {playerStats, teams} = this.getPlayerStats(type);
    if (playerStats.length !== 0) {
      return PlayerAchievements[type].reduce((acc, achievementGetter) => {
        acc = acc.concat(achievementGetter(playerStats, teams));
        return acc;
      }, []);
    }
    return [];
  }

  getPlayerStats(type) {
    switch (type) {
    case 'Vttl':
      return {playerStats: this.vttlPlayerStats, teams: this.vttlTeams};

    case 'Sporta':
      return {playerStats: this.sportaplayerStats, teams: this.sportaTeams};

    case 'belles':
    default:
      return {playerStats: this.playerStats, teams: this.teams};
    }
  }
}
