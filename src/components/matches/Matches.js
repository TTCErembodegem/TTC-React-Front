import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';
import moment from 'moment';

import Strike from '../controls/Strike.js';
import MatchCardHeader from './Match/MatchCardHeader.js';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    matches: state.matches,
  };
})
export default class Matches extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
  }

  componentDidMount() {
    this.context.setTitle();
  }

  render() {
    // TODO: put in some global config (or perhaps server config?)
    const matchesToShow = 10;
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

    return (
      <div>
        {matchesToday.size ? <Strike text={this.context.t('match.todayMatches')} style={{marginTop: 15}} /> : null}
        {this._renderMatches(matchesToday)}
        {matchesNext.size ? <Strike text={this.context.t('match.nextMatches')} style={{marginTop: 15}} /> : null}
        {this._renderMatches(matchesNext)}
        {matchesPlayed.size ? <Strike text={this.context.t('match.playedMatches')} style={{marginTop: 15}} /> : null}
        {this._renderMatches(matchesPlayed)}
      </div>
    );
  }

  _renderMatches(matches) {
    if (matches.size === 0) {
      return null;
    }

    return (
      <div className="row">
        {matches.map(match => (
          <div className="col-lg-4 col-md-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
            <MatchCardHeader match={match} user={this.props.user} isOpen={false} config={this.props.config} noScoreEdit />
          </div>
        ))}
      </div>
    );
  }
}