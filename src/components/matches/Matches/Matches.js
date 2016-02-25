import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { connect } from 'react-redux';

import MatchModel from '../../../models/MatchModel.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Matches.css';

//import { players as playerActionCreators } from '../../../actions/players.js';

import Divider from 'material-ui/lib/divider';

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
    matches: ImmutablePropTypes.listOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    user: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.context.setTitle();
  }

  render() {
    // TODO: put in some global config (or perhaps server config?)
    const showFutureMatchesDays = 4;
    const showPlayedMatchesDays = 20;

    var today = moment();
    //var yesterday = moment().subtract(1, 'days');  || cal.date.isSame(yesterday, 'day')
    var ownMatches = this.props.matches;

    var matchesToday = ownMatches.filter(cal => cal.date.isSame(today, 'day'));
    var matchesNext = ownMatches
      .filter(cal => cal.date.isAfter(today, 'day') && cal.date.diff(today, 'days') <= showFutureMatchesDays)
      .sort((a, b) => a.date - b.date);
    var matchesPlayed = ownMatches
      .filter(cal => cal.date.isBefore(today, 'day') && cal.date.diff(today, 'days') >= -showPlayedMatchesDays)
      .sort((a, b) => b.date - a.date);

    // TODO: implement buttonbar
    // TODO: debug inputfield: get and display a (frenoy)matchId -> also implement auto fetch if not present...
    return (
      <div>
        {matchesToday.size ? this._renderDivider(this.context.t('match.todayMatches')) : null}
        {this._renderMatches(matchesToday, 'today')}
        {matchesNext.size || matchesPlayed.size ? this._renderDivider(this.context.t('match.nextMatches')) : null}
        {this._renderMatches(matchesNext, 'next')}
        {matchesNext.size && matchesPlayed.size ? this._renderDivider(this.context.t('match.playedMatches')) : null}
        {this._renderMatches(matchesPlayed, 'played')}
      </div>
    );
  }
  _renderDivider(text) {
    return <div className="strike"><span>{text}</span></div>;
  }

  _renderMatches(matches, matchType) {
    if (matches.size === 0) {
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