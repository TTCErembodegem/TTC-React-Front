import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';

import MatchesTable from '../matches/MatchesTable.js';
import {PlayerCompetition} from '../controls.js';
import {WeekCalcer} from '../matches/MatchesWeeks/WeekCalcer.js';
import {WeekTitle} from '../matches/MatchesWeeks/WeekTitle.js';


@connect(state => ({
  matches: state.matches,
  readonlyMatches: state.readonlyMatches,
}))
export class TeamMatchesWeek extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    readonlyMatches: PropTypes.MatchModelList.isRequired,
    team: PropTypes.TeamModel.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentWeek: undefined,
    };
  }

  render() {
    var matches = this.props.matches;

    var ownMatches = this.props.team.getMatches();
    const weekCalcer = new WeekCalcer(ownMatches, this.state.currentWeek);

    var otherMatches = this.props.readonlyMatches
      .filter(m => m.week === weekCalcer.currentWeek)
      .filter(m => m.competition === this.props.team.competition)
      .filter(m => m.frenoyDivisionId === this.props.team.frenoy.divisionId);

    // TODO: we'll need to load them:
    // like matchActions :: getLastOpponentMatches

    // Geen MatchesTable (thank god)

    console.log('yaye', otherMatches.toArray());

    return (
      <div>
        <WeekTitle weekCalcer={weekCalcer} weekChange={weekDiff => this.setState({currentWeek: weekCalcer.currentWeek + weekDiff})} />

        <MatchesTable editMode={false} matches={weekCalcer.getMatches()} />
      </div>
    )
  }
}
