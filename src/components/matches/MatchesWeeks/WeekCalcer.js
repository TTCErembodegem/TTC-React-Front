import moment from 'moment';

export class WeekCalcer {
  constructor(matches, currentWeek) {
    this.matches = matches.sort((a, b) => a.date - b.date);
    this.lastWeek = this.calcLastWeek();
    this.currentWeek = currentWeek || this.calcCurrentWeek();
  }

  getMatches() {
    const week = this.getWeek();
    if (!week) {
      return [];
    }

    const matchFilter = match => match.week === this.currentWeek || match.date.isBetween(week.start, week.end);
    return this.matches.filter(matchFilter);
  }

  getWeek() {
    // TODO: // + natuurlijk de weekCalcer fixen :p
    const selectedWeekMatch = this.matches.find(match => match.week === this.currentWeek);
    if (!selectedWeekMatch) {
      return;
    }
    return {
      start: selectedWeekMatch.date.clone().startOf('week'),
      end: selectedWeekMatch.date.clone().endOf('week')
    };
  }

  calcLastWeek() {
    const lastWeekMatch = this.matches.last();
    return lastWeekMatch ? lastWeekMatch.week : 22;
  }

  calcCurrentWeek() {
    const today = moment();
    const currentWeekMatch = this.matches.find(x => x.date > today);
    return currentWeekMatch ? currentWeekMatch.week : this.lastWeek;
  }
}
