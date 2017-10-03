import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';

import MatchesTable from '../matches/MatchesTable.js';
import {PlayerCompetition} from '../controls.js';
import {WeekCalcer} from '../matches/MatchesWeeks/WeekCalcer.js';
import {WeekTitle} from '../matches/MatchesWeeks/WeekTitle.js';
import {getOpponentMatches} from '../../actions/matchActions.js';
import {OpponentMatches} from '../matches/Match/OpponentMatches.js';
import {FrenoyWeekLink} from '../controls.js';

@connect(state => ({
  matches: state.matches,
  readonlyMatches: state.readonlyMatches,
}), {getOpponentMatches})
export class TeamMatchesWeek extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    readonlyMatches: PropTypes.MatchModelList.isRequired,
    getOpponentMatches: PropTypes.func.isRequired,
    team: PropTypes.TeamModel.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentWeek: undefined,
    };
  }

  componentDidMount() {
    this.props.getOpponentMatches(this.props.team);
  }

  render() {
    const ownMatches = this.props.team.getMatches();
    const weekCalcer = new WeekCalcer(ownMatches, this.state.currentWeek);

    var otherMatches = this.props.readonlyMatches
      .filter(m => m.week === weekCalcer.currentWeek)
      .filter(m => m.competition === this.props.team.competition)
      .filter(m => m.frenoyDivisionId === this.props.team.frenoy.divisionId);

    return (
      <div>
        <WeekTitle weekCalcer={weekCalcer} weekChange={weekDiff => this.setState({currentWeek: weekCalcer.currentWeek + weekDiff})} />

        <OpponentMatches team={this.props.team} readonlyMatches={otherMatches} />
      </div>
    )
  }
}
