import {getPlayerStats} from '../../../models/TeamModel.js';
import PlayerAchievements from './PlayerAchievements.js';

export class AchievementsCalculator {
  constructor(players, matches) {
    this.players = players;
    this.matches = matches;
    this.playerStats = getPlayerStats(this.matches, true);
    console.log('yaye', this.playerStats);
  }

  getAchievements() {
    if (this.playerStats.length !== 0) {
      return PlayerAchievements.reduce((acc, achievementGetter) => {
        acc = acc.concat(achievementGetter(this.playerStats));
        return acc;
      }, []);
    }
    return [];
  }
}
