import React, { Component, PropTypes } from 'react';
import { util as storeUtils } from '../../../store.js';
import withViewport from '../../../utils/decorators/withViewport.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import MatchModel from '../../../models/MatchModel.js';

import Table from 'react-bootstrap/lib/Table';
import OpponentPlayer from './OpponentPlayer.js';
import Spinner from '../../controls/Spinner.js';

const AmountOfOpponentMatchesToShow = 5;

@withViewport
export default class OpponentsLastMatches extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    viewport: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const widthRemoveColumn = 450; // combine Home&Away columns to just one Opponent column on small devices

    var matches = storeUtils.matches
      .getFromOpponent(this.props.match.opponent)
      .sort((a, b) => a.date.isBefore(b.date) ? 1 : -1)
      .filter(match => match.score)
      .take(AmountOfOpponentMatchesToShow);

    if (matches.size === 0) {
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }

    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th key="1">{this.context.t('match.opponents.date')}</th>
            {this.props.viewport.width > widthRemoveColumn ? [
              <th key="2">{this.context.t('match.opponents.homeTeam')}</th>,
              <th key="3">{this.context.t('match.opponents.awayTeam')}</th>
            ] : (
              <th key="4">{this.context.t('match.opponents.vsTeam')}</th>
            )}
            <th key="5">{this.context.t('match.opponents.formation')}</th>
            <th key="6">{this.context.t('match.opponents.outcome')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => {
            var opponent = this.props.match.opponent;
            var opponentFormation;
            var isHomeMatch = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
            if (isHomeMatch) {
              opponentFormation = match.players.filter(m => m.home);
            } else {
              opponentFormation = match.players.filter(m => !m.home);
            }

            return [
              <tr key={match.id} className={'clickable ' + (match.won(opponent) ? 'accentuate success' : '')}
                onClick={this._onOpenOpponentMatch.bind(this, match.id)}>

                <td key="1">{match.getDisplayDate('d')}</td>
                {this.props.viewport.width > widthRemoveColumn ? [
                  <td key="2">{match.getClub('home').name} {match.home.teamCode}</td>,
                  <td key="3">{match.getClub('away').name} {match.away.teamCode}</td>
                ] : (
                  <td key="4">
                    {isHomeMatch ? (match.getClub('away').name + ' ' + match.away.teamCode) : (match.getClub('home').name + ' ' + match.home.teamCode)}
                  </td>
                )}

                <td key="5">{opponentFormation.map(ply => ply.ranking).join(', ')}</td>
                <td key="6">{match.score.home} - {match.score.out}</td>
              </tr>,
              this._getMatchDetails(match)
            ];
          })}
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
        <td colSpan={5}>
          <h4 style={{marginTop: 5}}>{match.getClub('home').name} {match.home.teamCode}</h4>
          {match.getOwnPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={this.context.t} />)}

          <h4>{match.getClub('away').name} {match.away.teamCode}</h4>
          {match.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={this.context.t} />)}
        </td>
      </tr>
    );
  }
}