import React, {Component} from 'react';
import PropTypes, {connect, browserHistory} from '../PropTypes.js';
import moment from 'moment';
import * as adminActions from '../../actions/adminActions.js';

import {Icon, ButtonStack, EmailButton, EditButton} from '../controls.js';
import MatchesTable from './MatchesTable.js';
import Button from 'react-bootstrap/lib/Button';
import {MatchesWeekMail} from './MatchesWeeks/MatchesWeekEmail.js';
import {WeekTitle} from './MatchesWeeks/weekTitle.js';

@connect(state => ({matches: state.matches, user: state.user, freeMatches: state.freeMatches}))
export default class MatchesWeek extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
    params: PropTypes.shape({
      tabKey: PropTypes.string,
      comp: PropTypes.oneOf(['Vttl', 'Sporta']),
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      currentWeek: 1,
      lastWeek: 22,
      editMode: false,
      mailFormOpen: false,
    };

    const currentWeek = this.getCurrentWeek(props);
    if (currentWeek) {
      this.state = Object.assign(this.state, currentWeek);
    }
  }

  getCurrentWeek(props) {
    if ((!this.state.fixedWeek || props.params.tabKey !== this.state.currentWeek) && props.matches.size) {
      const today = moment();
      const sortedMatches = props.matches.sort((a, b) => a.date - b.date);
      const currentWeekMatch = sortedMatches.find(x => x.date > today);
      const lastWeekMatch = sortedMatches.last();
      const lastWeek = lastWeekMatch ? lastWeekMatch.week : 22;

      var calcedState = {
        currentWeek: currentWeekMatch ? currentWeekMatch.week : lastWeek,
        lastWeek: lastWeek,
        fixedWeek: true
      };
      if (props.params.tabKey) {
        calcedState.currentWeek = parseInt(props.params.tabKey, 10);
      }
      return calcedState;
    }
  }

  componentWillReceiveProps(props) {
    const currentWeek = this.getCurrentWeek(props);
    if (currentWeek) {
      this.setState(currentWeek);
    }
  }

  _onChangeWeek(weekDiff) {
    const comp = this.props.params.comp;
    const compFilter = comp && comp !== 'all' ? '/' + this.props.params.comp : '';
    browserHistory.push(this.context.t.route('matchesWeek') + '/' + (this.state.currentWeek + weekDiff) + compFilter);
  }
  _onChangeCompetition(comp) {
    browserHistory.push(this.context.t.route('matchesWeek') + '/' + this.state.currentWeek + (comp && comp !== 'all' ? '/' + comp : ''));
  }

  render() {
    const t = this.context.t;

    const selectedWeekMatch = this.props.matches.find(match => match.week === this.state.currentWeek);
    // ATTN: The above calc is not correct :)
    if (!selectedWeekMatch) {
      return null;
    }

    const weekStart = selectedWeekMatch.date.clone().startOf('week');
    const weekEnd = selectedWeekMatch.date.clone().endOf('week');
    const matchFilter = match => match.week === this.state.currentWeek || match.date.isBetween(weekStart, weekEnd);

    var matches = this.props.matches.filter(matchFilter);
    if (this.state.editMode) {
      const freeMatches = this.props.freeMatches.filter(matchFilter);
      matches = matches.concat(freeMatches);
    }

    if (this.state.mailFormOpen) {
      return (
        <div>
          <h3 style={{textAlign: 'center'}}><WeekTitle t={t} weekNr={this.state.currentWeek} weekStart={weekStart} weekEnd={weekEnd} /></h3>
          <MatchesWeekMail
            onHide={() => this.setState({mailFormOpen: false})}
            matches={matches.filter(x => !this.state.filter || x.competition === this.state.filter).filter(x => x.shouldBePlayed)}
          />
        </div>
      );
    }

    const viewsConfig = [{
      key: 'all',
      text: this.context.t('players.all')
    }, {
      key: 'Vttl',
      text: 'Vttl'
    }, {
      key: 'Sporta',
      text: 'Sporta'
    }];

    const compFilter = this.props.params.comp || 'all';
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>
          <Icon fa="fa fa-arrow-left" style={{marginRight: 10, visibility: this.state.currentWeek > 1 ? '' : 'hidden'}} onClick={this._onChangeWeek.bind(this, -1)} />
          <WeekTitle t={t} weekNr={this.state.currentWeek} weekStart={weekStart} weekEnd={weekEnd} />
          {this.state.currentWeek < this.state.lastWeek ? (
            <Icon fa="fa fa-arrow-right" style={{marginLeft: 10}} onClick={this._onChangeWeek.bind(this, 1)} />
          ) : null}
        </h3>

        <span className="button-bar-right">
          <ButtonStack
            config={viewsConfig}
            small={false}
            activeView={compFilter}
            onClick={newCompFilter => this._onChangeCompetition(newCompFilter)}
          />

          {this.props.user.canManageTeams() && matches.some(m => !m.isSyncedWithFrenoy) ? (
            <EditButton onClick={() => this.setState({editMode: !this.state.editMode})} />
          ) : null}
          {this.props.user.isAdmin() && matches.some(m => !m.isSyncedWithFrenoy) ? (
            <EmailButton onClick={() => this.setState({mailFormOpen: !this.state.mailFormOpen})} />
          ) : null}
        </span>

        {compFilter !== 'Sporta' ? <MatchesWeekPerCompetition comp="Vttl" editMode={this.state.editMode} matches={matches} /> : null}
        {compFilter !== 'Vttl' && compFilter !== 'Sporta' ? <hr style={{marginLeft: '10%', marginRight: '10%', marginTop: 50}} /> : null}
        {compFilter !== 'Vttl' ? <MatchesWeekPerCompetition comp="Sporta" editMode={this.state.editMode} matches={matches} /> : null}
      </div>
    );
  }
}


const MatchesWeekPerCompetition = ({comp, editMode, matches}) => {
  // TODO: fixed sort by team now... adding sorting should only be done after serious refactoring of MatchesTable
  //const matchSorter = (a, b) => a.date - b.date;
  const matchSorter = (a, b) => a.getTeam().teamCode - b.getTeam().teamCode;

  return (
    <div>
      <h4><strong>{comp}</strong></h4>
      <MatchesTable editMode={editMode} matches={matches.filter(x => x.competition === comp).sort(matchSorter)} />
    </div>
  );
};
