import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes';
import {WeekCalcer} from '../matches/MatchesWeeks/WeekCalcer';
import {WeekTitle} from '../matches/MatchesWeeks/WeekTitle';
import {getOpponentMatches} from '../../actions/matchActions';
import {OpponentMatches} from '../matches/Match/OpponentMatches';
import { FrenoyWeekButton } from '../controls/Buttons/FrenoyButton';

class TeamMatchesWeekComponent extends Component {
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
    this.props.getOpponentMatches(this.props.team.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.team !== this.props.team) {
      this.props.getOpponentMatches(nextProps.team.id);
    }
  }

  render() {
    const otherMatches = this.props.readonlyMatches
      .filter(m => m.competition === this.props.team.competition)
      .filter(m => m.frenoyDivisionId === this.props.team.frenoy.divisionId)
      .filter(m => m.shouldBePlayed);

    const weekCalcer = new WeekCalcer(otherMatches, this.state.currentWeek);

    let prevWeekMatches = null;
    if (!this.state.currentWeek && weekCalcer.currentWeek > weekCalcer.firstWeek) {
      // TODO: Should calculate NEXT and PREVIOUS matches
      // --> At this point in the week, the match can already be played
      const prevWeekCalcer = new WeekCalcer(otherMatches, weekCalcer.currentWeek - 1);
      prevWeekMatches = prevWeekCalcer.getMatches();
    }

    return (
      <div>
        <FrenoyWeekButton team={this.props.team} week={weekCalcer.currentWeek} className="pull-right" style={{marginRight: 10}} />
        <WeekTitle weekCalcer={weekCalcer} weekChange={weekDiff => this.setState({currentWeek: weekCalcer.currentWeek + weekDiff})} />
        <OpponentMatches team={this.props.team} readonlyMatches={weekCalcer.getMatches()} />

        {prevWeekMatches ? (
          <div style={{marginTop: 50}}>
            <WeekTitle weekCalcer={new WeekCalcer(otherMatches, weekCalcer.currentWeek - 1)} />
            <OpponentMatches team={this.props.team} readonlyMatches={prevWeekMatches} />
          </div>
        ) : null}
      </div>
    );
  }
}

export const TeamMatchesWeek = connect(state => ({
  matches: state.matches,
  readonlyMatches: state.readonlyMatches,
}), {getOpponentMatches})(TeamMatchesWeekComponent);
