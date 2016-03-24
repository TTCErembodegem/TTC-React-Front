import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { connect } from 'react-redux';

import MatchModel from '../../models/MatchModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';

import Strike from '../controls/Strike.js';
import MatchCardHeader from './Match/MatchCardHeader.js';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
  };
})
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
    const matchesToShow = 7;
    //const showFutureMatchesDays = 7;
    //const showPlayedMatchesDays = 20;

    var today = moment();
    //var yesterday = moment().subtract(1, 'days');  || cal.date.isSame(yesterday, 'day')
    var ownMatches = this.props.matches;

    var matchesToday = ownMatches.filter(cal => cal.date.isSame(today, 'day'));
    var matchesNext = ownMatches
      .filter(cal => cal.date.isAfter(today, 'day')) // && cal.date.diff(today, 'days') <= showFutureMatchesDays)
      .sort((a, b) => a.date - b.date)
      .take(matchesToShow);
    var matchesPlayed = ownMatches
      .filter(cal => cal.date.isBefore(today, 'day')) // && cal.date.diff(today, 'days') >= -showPlayedMatchesDays)
      .sort((a, b) => b.date - a.date)
      .take(matchesToShow);

    // TODO: implement buttonbar
    // TODO: debug inputfield: get and display a (frenoy)matchId -> also implement auto fetch if not present...
    // TODO: load more buttons
    return (
      <div>
        {matchesToday.size ? <Strike text={this.context.t('match.todayMatches')} style={{marginTop: 25}} /> : null}
        {this._renderMatches(matchesToday)}
        {matchesNext.size || matchesPlayed.size ? <Strike text={this.context.t('match.nextMatches')} style={{marginTop: 25}} /> : null}
        {this._renderMatches(matchesNext)}
        {matchesNext.size && matchesPlayed.size ? <Strike text={this.context.t('match.playedMatches')} style={{marginTop: 25}} /> : null}
        {this._renderMatches(matchesPlayed)}
      </div>
    );
  }

  _renderMatches(matches) {
    if (matches.size === 0) {
      return null;
    }

    return <BootstrapMatchCard matches={matches} user={this.props.user} />;
  }
}

const BootstrapMatchCard = ({matches, user}) => (
  <div className="row">
    {matches.map(match => (
      <div className="col-lg-4 col-md-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
        <MatchCardHeader match={match} user={user} isOpen={false} />
      </div>
    ))}
  </div>
);