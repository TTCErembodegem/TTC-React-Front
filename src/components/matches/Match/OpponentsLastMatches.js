import React, { Component, PropTypes } from 'react';
import { util as storeUtils } from '../../../store.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import MatchModel from '../../../models/MatchModel.js';

import Table from 'react-bootstrap/lib/Table';
import OpponentPlayer from './OpponentPlayer.js';

const AmountOfOpponentMatchesToShow = 5;

export default class OpponentsLastMatches extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var matches = storeUtils.matches
      .getFromOpponent(this.props.match.opponent)
      .sort((a, b) => a.date.isBefore(b.date) ? 1 : -1)
      .take(AmountOfOpponentMatchesToShow);

    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th>{this.context.t('match.opponents.date')}</th>
            <th>{this.context.t('match.opponents.homeTeam')}</th>
            <th>{this.context.t('match.opponents.awayTeam')}</th>
            <th>{this.context.t('match.opponents.outcome')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => [
            <tr key={match.id} className={'clickable ' + (match.won(this.props.match.opponent) ? 'accentuate success' : '')}
              onClick={this._onOpenOpponentMatch.bind(this, match.id)}>

              <td>{match.getDisplayDate('d')}</td>
              <td>{match.getClub('home').name} {match.home.teamCode}</td>
              <td>{match.getClub('away').name} {match.away.teamCode}</td>
              <td>{match.score.home} - {match.score.out}</td>
            </tr>,
            this._getMatchDetails(match)
          ])}
        </tbody>
      </Table>
    );
  }
  _onOpenOpponentMatch(matchId) {
    this.setState({[matchId]: !this.state[matchId]});
  }
  _getMatchDetails(match) {
    if (!this.state[match.id]) {
      return null;
    }
    return (
      <tr key={match.id + '_details'}>
        <td colSpan={4}>
          <h4 style={{marginTop: 5}}>{match.getClub('home').name} {match.home.teamCode}</h4>
          {match.getOwnPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={this.context.t} />)}

          <h4>{match.getClub('away').name} {match.away.teamCode}</h4>
          {match.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={this.context.t} />)}
        </td>
      </tr>
    );
  }
}