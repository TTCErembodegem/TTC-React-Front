import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import MatchModel from '../../../models/MatchModel.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Matches.css';

import { players as playerActionCreators } from '../../../actions/players.js';

import { MatchToday, MatchNext, MatchPlayed } from '../Match/';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    calendar: state.calendar,
    teams: state.teams,
  };
}, playerActionCreators)
@withStyles(styles)
export default class Matches extends Component {
  static contextTypes = contextTypes;

  static propTypes = {
    calendar: PropTypes.arrayOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    user: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.context.setTitle();
  }

  render() {
    var today = moment();
    var matchesToday = this.props.calendar.filter(cal => cal.date.isSame(today, 'day'));
    var matchesNext = this.props.calendar.filter(cal => cal.date.isAfter(today, 'day'));
    var matchesPlayed = this.props.calendar.filter(cal => cal.date.isBefore(today, 'day'));

    return (
      <div>
        {this._renderMatches(matchesToday, MatchToday)}
        {matchesToday.length && (matchesNext.length || matchesPlayed.length) ? this._renderDivider() : null}
        {this._renderMatches(matchesNext, MatchNext)}
        {matchesNext.length && matchesPlayed.length ? this._renderDivider() : null}
        {this._renderMatches(matchesPlayed, MatchPlayed)}
      </div>
    );
  }
  _renderDivider() {
    return <div className="row"></div>;
  }

  _renderMatches(matches, MatchComponent) {
    if (matches.length === 0) {
      return null;
    }

    return (
      <div className="row">
        {matches.map(match => <MatchComponent match={match} key={match.id} userTeams={this.props.user.teams} />)}
      </div>
    );
  }
}