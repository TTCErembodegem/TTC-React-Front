import moment from 'moment';

export class WeekCalcer {
  constructor(matches, currentWeek, includeFreeMatches = false) {
    this.includeFreeMatches = includeFreeMatches;
    this.matches = matches.sort((a, b) => a.date - b.date);
    this.setCurrentWeeks(currentWeek);
  }

  getMatches() {
    const week = this.getWeek();
    // TODO: the includeFreeMatches is broken because this.weeks needs a weekSorta and weekVttl prop...
    // const matchFilter = match => match.date.isBetween(week.start, week.end) || (this.includeFreeMatches && match.week === this.currentWeek);
    const matchFilter = match => match.date.isBetween(week.start, week.end);
    return this.matches.filter(matchFilter);
  }

  getWeek() {
    return this.weeks[this.currentWeek - 1];
  }

  setCurrentWeeks(currentWeek) {
    this.currentWeek = currentWeek;
    if (!this.matches.size) {
      this.firstWeek = 1;
      this.currentWeek = 1;
      this.lastWeek = 22;
      this.weeks = [{start: moment().startOf('week'), end: moment().endOf('week')}];
      return;
    }
    this.weeks = this.matches.reduce((acc, next) => {
      const date = next.date.clone().startOf('week');
      if (!acc.length || !acc[acc.length - 1].start.isSame(date, 'day')) {
        acc.push({start: date, end: next.date.clone().endOf('week')});
      }
      return acc;
    }, []);

    // console.log('weekz', this.weeks.map(x => x.start.toString() + " -> " + x.end.toString()));

    this.firstWeek = 1;
    this.lastWeek = this.weeks.length;

    if (!this.currentWeek) {
      let testWeek = moment().startOf('week');
      const indexFinder = w => w.start.isSame(testWeek, 'day');
      while (!this.currentWeek) {
        this.currentWeek = this.weeks.findIndex(indexFinder) + 1;
        testWeek = testWeek.add(1, 'week');
        if (testWeek.isAfter(this.weeks[this.weeks.length - 1].end)) {
          this.currentWeek = this.lastWeek;
          break;
        }
      }
    }
  }
}
