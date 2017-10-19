import React, {Component} from 'react';
import PropTypes, {connect, browserHistory} from '../PropTypes.js';

import {ButtonStack, EditButton} from '../controls.js';
import MatchesTable from './MatchesTable.js';
import {MatchesWeekEmail} from './MatchesWeeks/MatchesWeekEmail.js';
import {WeekTitle} from './MatchesWeeks/WeekTitle.js';
import {WeekCalcer} from './MatchesWeeks/WeekCalcer.js';


@connect(state => ({matches: state.matches, user: state.user, freeMatches: state.freeMatches}))
export default class MatchesWeek extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    freeMatches: PropTypes.MatchModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
    params: PropTypes.shape({
      tabKey: PropTypes.string, // : number == current Frenoy week
      comp: PropTypes.oneOf(['Vttl', 'Sporta']),
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      currentWeek: undefined,
      editMode: false,
    };

    const currentWeek = this.getCurrentWeek(props);
    if (currentWeek) {
      this.state = Object.assign(this.state, currentWeek);
    }
  }

  getCurrentWeek(props) {
    if (props.params.tabKey && props.matches.size) {
      return {currentWeek: parseInt(props.params.tabKey, 10)};
    }
  }

  componentWillReceiveProps(props) {
    const currentWeek = this.getCurrentWeek(props);
    if (currentWeek) {
      this.setState(currentWeek);
    }
  }

  _onChangeWeek(currentWeek, weekDiff) {
    const comp = this.props.params.comp;
    const compFilter = comp && comp !== 'all' ? '/' + this.props.params.comp : '';
    browserHistory.push(this.context.t.route('matchesWeek') + '/' + (currentWeek + weekDiff) + compFilter);
  }
  _onChangeCompetition(currentWeek, comp) {
    browserHistory.push(this.context.t.route('matchesWeek') + '/' + currentWeek + (comp && comp !== 'all' ? '/' + comp : ''));
  }

  render() {
    const t = this.context.t;

    var allMatches = this.props.matches;
    if (this.state.editMode) {
      allMatches = allMatches.concat(this.props.freeMatches);
    }

    const weekCalcer = new WeekCalcer(allMatches, this.state.currentWeek, this.state.editMode);
    const matches = weekCalcer.getMatches();
    if (matches.size === 0) {
      return null;
    }

    const viewsConfig = [
      {key: 'all', text: t('common.all')},
      {key: 'Vttl', text: 'Vttl'},
      {key: 'Sporta', text: 'Sporta'}
    ];

    // TODO: MatchesWeekEmail: hier gewoon het icon en verander de route... /mail

    const compFilter = this.props.params.comp || 'all';
    return (
      <div>
        <WeekTitle weekCalcer={weekCalcer} weekChange={this._onChangeWeek.bind(this, weekCalcer.currentWeek)} />

        <span className="button-bar-right">
          <ButtonStack
            config={viewsConfig}
            small={false}
            activeView={compFilter}
            onClick={newCompFilter => this._onChangeCompetition(weekCalcer.currentWeek, newCompFilter)}
          />

          {this.props.user.canManageTeams() && matches.some(m => !m.isSyncedWithFrenoy) ? (
            <EditButton onClick={() => this.setState({editMode: !this.state.editMode})} />
          ) : null}
          {this.props.user.isAdmin() && matches.some(m => !m.isSyncedWithFrenoy) ? (
            <MatchesWeekEmail
              weekCalcer={weekCalcer}
              matches={matches.filter(x => !this.state.filter || x.competition === this.state.filter).filter(x => x.shouldBePlayed)}
            />
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
  const matchSorter = (a, b) => a.getTeam().teamCode.localeCompare(b.getTeam().teamCode);

  matches = matches.filter(x => x.competition === comp);
  if (matches.size === 0) {
    return null;
  }

  return (
    <div>
      <h4><strong>{comp}</strong></h4>
      <MatchesTable editMode={editMode} matches={matches.sort(matchSorter)} ownTeamLink="week" />
    </div>
  );
};

MatchesWeekPerCompetition.propTypes = {
  comp: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
  editMode: PropTypes.bool.isRequired,
  matches: PropTypes.MatchModelList.isRequired,
};
