import {getPlayerStats} from '../../../models/TeamModel.js';
import PlayerAchievements from './PlayerAchievements.js';

export class AchievementsCalculator {
  constructor(players, matches) {
    this.players = players;
    this.matches = matches;
    this.playerStats = getPlayerStats(this.matches, true);

    const vttlMatches = this.matches.filter(m => m.competition === 'Vttl');
    this.vttlPlayerStats = getPlayerStats(vttlMatches, true);

    const sportaMatches = this.matches.filter(m => m.competition === 'Sporta');
    this.sportaplayerStats = getPlayerStats(sportaMatches, true).filter(x => !x.isDoubles);

    // console.log('matches', this.matches.first());
    console.log('yaye', this.sportaplayerStats);
  }

  getAchievements(type) {
    const playerStats = this.getPlayerStats(type);
    if (playerStats.length !== 0) {
      return PlayerAchievements[type].reduce((acc, achievementGetter) => {
        acc = acc.concat(achievementGetter(playerStats));
        return acc;
      }, []);
    }
    return [];
  }

  getPlayerStats(type) {
    switch (type) {
    case 'Vttl':
      return this.vttlPlayerStats;

    case 'Sporta':
      return this.sportaplayerStats;

    case 'belles':
    default:
      return this.playerStats;
    }
  }
}
