import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import MatchModel from '../../../models/MatchModel.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Matches.css';

//import { players as playerActionCreators } from '../../../actions/players.js';

import MatchCard from '../Match/MatchCard.js';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
  };
}/*, playerActionCreators*/)
@withStyles(styles)
export default class Matches extends Component {
  static contextTypes = contextTypes;

  static propTypes = {
    matches: PropTypes.arrayOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    user: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.context.setTitle();
  }

  render() {
    var today = moment();
    var matchesToday = this.props.matches.filter(cal => cal.date.isSame(today, 'day'));
    var matchesNext = this.props.matches.filter(cal => cal.date.isAfter(today, 'day'));
    var matchesPlayed = this.props.matches.filter(cal => cal.date.isBefore(today, 'day'));

    return (
      <div>
        <div className="row">
          <button>Alle matchen</button> <button>Mijn matchen</button> (use pills?)
        </div>
        {this._renderMatches(matchesToday, 'today')}
        {matchesToday.length && (matchesNext.length || matchesPlayed.length) ? this._renderDivider() : null}
        {this._renderMatches(matchesNext, 'next')}
        {matchesNext.length && matchesPlayed.length ? this._renderDivider() : null}
        {this._renderMatches(matchesPlayed, 'played')}
      </div>
    );
  }
  _renderDivider() {
    return <div className="row"></div>;
  }

  _renderMatches(matches, matchType) {
    if (matches.length === 0) {
      return null;
    }

    return (
      <div>
        <div className="row">
          {matches.map(match => <MatchCard match={match} key={match.id} user={this.props.user} type={matchType} />)}
        </div>
      </div>
    );
  }
}