import moment from 'moment';

export class WeekCalcer {
  constructor(matches, currentWeek, includeFreeMatches = false) {
    this.includeFreeMatches = includeFreeMatches;
    this.matches = matches.sort((a, b) => a.date - b.date);
    this.lastWeek = this.calcLastWeek();
    this.firstWeek = this.calcFirstWeek();
    this.currentWeek = currentWeek || this.calcCurrentWeek();
  }

  getMatches() {
    const week = this.getWeek();
    if (!week) {
      return [];
    }

    const matchFilter = match => match.date.isBetween(week.start, week.end) || (this.includeFreeMatches && match.week === this.currentWeek);
    return this.matches.filter(matchFilter);
  }

  getWeek() {
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
  calcFirstWeek() {
    const firstWeek = this.matches.map(x => x.week).reduce((min, next) => Math.min(min, next), 22);
    const firstWeekMatch = this.matches.find(x => x.week === firstWeek);
    return firstWeekMatch ? firstWeekMatch.week : 1;
  }

  calcCurrentWeek() {
    const today = moment();
    const currentWeekMatch = this.matches.find(x => x.date > today);
    return currentWeekMatch ? currentWeekMatch.week : this.lastWeek;
  }
}
