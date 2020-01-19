import React, {Component} from 'react';
import moment from 'moment';
import PropTypes, {connect, withContext} from '../PropTypes';

import {Strike} from '../controls/controls/Strike';
import {SmallMatchCardHeader} from './Match/MatchCardHeader';


class Matches extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
  }

  componentDidMount() {
    this.context.setTitle();
  }

  // render() {
  //   const today = moment().startOf('day');
  //   const matches = this.props.matches.filter(cal => cal.date.isAfter(today, 'day')).groupBy(match => moment(match.date).startOf('day'))
  //   return (
  //     <div>
  //       {matches.map((matchesOnDay, matchDate) => {
  //         //console.log('ughoh', matchDate, matchesOnDay);
  //         return (
  //         <div>
  //           <div>
  //             <div>{matchDate.format('D/M')}</div>
  //             <div>{matchDate.format('dd')}</div>
  //           </div>
  //           <div>
  //             {this._renderMatches(matchesOnDay)}
  //           </div>
  //         </div>
  //       )})}
  //     </div>
  //   );
  // }

  render() {
    // TODO: put in some global config (or perhaps server config?)
    const matchesToShow = 10;
    // const showFutureMatchesDays = 7;
    // const showPlayedMatchesDays = 20;

    const today = moment();
    // const yesterday = moment().subtract(1, 'days');  || cal.date.isSame(yesterday, 'day')
    const ownMatches = this.props.matches;

    const matchesToday = ownMatches.filter(cal => cal.date.isSame(today, 'day'));
    const matchesNext = ownMatches
      .filter(cal => cal.date.isAfter(today, 'day')) // && cal.date.diff(today, 'days') <= showFutureMatchesDays)
      .sort((a, b) => a.date - b.date)
      .take(matchesToShow);
    const matchesPlayed = ownMatches
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
            <SmallMatchCardHeader match2={match} user={this.props.user} isOpen={false} config={this.props.config} noScoreEdit />
          </div>
        ))}
      </div>
    );
  }
}

export default withContext(connect(state => ({
  config: state.config,
  user: state.user,
  matches: state.matches,
}))(Matches));
