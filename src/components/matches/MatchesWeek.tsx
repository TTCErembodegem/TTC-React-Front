import React, {Component} from 'react';
import PropTypes, {connect, withRouter} from '../PropTypes';
import MatchesTable from './MatchesTable';
import {MatchesWeekEmail} from './MatchesWeeks/MatchesWeekEmail';
import {WeekTitle} from './MatchesWeeks/WeekTitle';
import {WeekCalcer} from './MatchesWeeks/WeekCalcer';
import {ButtonStack} from '../controls/Buttons/ButtonStack';
import {EditButton} from '../controls/Buttons/EditButton';



class MatchesWeek extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    freeMatches: PropTypes.MatchModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tabKey: PropTypes.string, // : number == current Frenoy week
        comp: PropTypes.oneOf(['Vttl', 'Sporta']),
      }),
    }),
    history: PropTypes.any.isRequired,
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
    if (props.match.params.tabKey && props.matches.size) {
      return {currentWeek: parseInt(props.match.params.tabKey, 10)};
    }
  }

  componentWillReceiveProps(props) {
    const currentWeek = this.getCurrentWeek(props);
    if (currentWeek) {
      this.setState(currentWeek);
    }
  }

  _onChangeWeek(currentWeek, weekDiff) {
    const {comp} = this.props.match.params;
    const compFilter = comp && comp !== 'all' ? `/${this.props.match.params.comp}` : '';
    this.props.history.push(`${this.context.t.route('matchesWeek')}/${currentWeek + weekDiff}${compFilter}`);
  }

  _onChangeCompetition(currentWeek, comp) {
    this.props.history.push(`${this.context.t.route('matchesWeek')}/${currentWeek}${comp && comp !== 'all' ? `/${comp}` : ''}`);
  }

  render() {
    const {t} = this.context;

    let allMatches = this.props.matches;
    if (this.state.editMode) {
      allMatches = allMatches.concat(this.props.freeMatches);
    }

    const weekCalcer = new WeekCalcer(allMatches, this.state.currentWeek, this.state.editMode);
    const matches = weekCalcer.getMatches();
    if (matches.size === 0) {
      return null;
    }

    const compFilter = this.props.match.params.comp || 'all';

    let matchMailing = null;
    if (compFilter !== 'all' && this.props.user.isAdmin() && matches.some(m => !m.isSyncedWithFrenoy)) {
      let prevMatches = [];
      if (this.state.currentWeek > 1) {
        let prevWeekCalc = new WeekCalcer(allMatches, this.state.currentWeek - 1, this.state.editMode);
        prevMatches = prevWeekCalc.getMatches().filter(m => m.competition === compFilter);
        if (this.state.currentWeek > 2 && prevMatches.size === 0) {
          prevWeekCalc = new WeekCalcer(allMatches, this.state.currentWeek - 2, this.state.editMode);
          prevMatches = prevWeekCalc.getMatches();
        }
      }
      matchMailing = (
        <MatchesWeekEmail
          weekCalcer={weekCalcer}
          matches={matches.filter(x => !compFilter || x.competition === compFilter).filter(x => x.shouldBePlayed)}
          prevMatches={prevMatches.filter(x => !compFilter || x.competition === compFilter).filter(x => x.shouldBePlayed)}
          compFilter={compFilter}
        />
      );
    }

    const viewsConfig = [
      {key: 'all', text: t('common.all')},
      {key: 'Vttl', text: 'Vttl'},
      {key: 'Sporta', text: 'Sporta'},
    ];

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


          {matchMailing}
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
  // const matchSorter = (a, b) => a.date - b.date;
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

export default withRouter(connect(state => ({matches: state.matches, user: state.user, freeMatches: state.freeMatches}))(MatchesWeek));
