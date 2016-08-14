import React, { Component } from 'react';
import PropTypes, { withViewport } from '../../PropTypes.js';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import Table from 'react-bootstrap/lib/Table';
import IconButton from 'material-ui/lib/icon-button';
import OpponentPlayer from './OpponentPlayer.js';
import Spinner from '../../controls/Spinner.js';
import MatchScore from '../MatchScore.js';

const AmountOfOpponentMatchesToShow = 5;

@withViewport
export default class OpponentsLastMatches extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    otherMatch: PropTypes.MatchModel,
    readonlyMatches: PropTypes.object.isRequired,
    viewport: PropTypes.viewport,
  }

  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
    };
  }

  _gotoMatchCard(match) {
    const matchRoute = this.context.t.route('match', {matchId: match.id});
    browserHistory.push(matchRoute);
  }

  render() {
    const widthRemoveColumn = 500; // combine Home&Away columns to just one Opponent column on small devices
    var firstBattle;
    const otherMatch = this.props.otherMatch;
    if (otherMatch) {
      const wasPrev = this.props.match.date > otherMatch.date;
      firstBattle = (
        <Link to={this.context.t.route('match', {matchId: otherMatch.id})}>
          <button type="button" className="btn btn-default"
            onClick={this._gotoMatchCard.bind(this, otherMatch)}
            style={{margin: 7}}>
            <div>
              <span style={{marginRight: 6}}>{this.context.t('match.' + (wasPrev ? 'gotoPreviousEncounter' : 'gotoNextEncounter'))}</span>
              <MatchScore match={otherMatch} forceDisplay={true} />
            </div>
          </button>
        </Link>
      );
    }

    var matches = this.props.readonlyMatches;
    if (!this.state.showAll) {
      matches = matches.take(AmountOfOpponentMatchesToShow);
    }
    if (matches.size === 0) {
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }

    return (
      <div>
      {firstBattle}
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th key="1">{this.context.t('common.date')}</th>
            {this.props.viewport.width > widthRemoveColumn ? [
              <th key="2">{this.context.t('match.opponents.homeTeam')}</th>,
              <th key="3">{this.context.t('match.opponents.awayTeam')}</th>
            ] : (
              <th key="4">{this.context.t('match.opponents.vsTeam')}</th>
            )}
            <th key="5">{this.context.t('common.teamFormation')}</th>
            <th key="6">{this.context.t('match.opponents.outcome')}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => {
            const opponent = this.props.match.opponent;
            const isHomeMatch = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
            var opponentFormation;
            if (isHomeMatch) {
              opponentFormation = match.players.filter(m => m.home);
            } else {
              opponentFormation = match.players.filter(m => !m.home);
            }

            return [
              <tr key={match.id} className={'clickable ' + (match.won(this.props.match.opponent) ? 'accentuate success' : '')}
                onClick={this._onOpenOpponentMatch.bind(this, match.id)}>

                <td key="1">{match.getDisplayDate(this.props.viewport.width > widthRemoveColumn ? 'd' : 's')}</td>
                {this.props.viewport.width > widthRemoveColumn ? [
                  <td key="2">{match.getClub('home').name} {match.home.teamCode}</td>,
                  <td key="3">{match.getClub('away').name} {match.away.teamCode}</td>
                ] : (
                  <td key="4">
                    {isHomeMatch ? (match.getClub('away').name + ' ' + match.away.teamCode)
                    : (match.getClub('home').name + ' ' + match.home.teamCode)}
                  </td>
                )}

                <td key="5">{this._getFormationRankingString(opponentFormation.map(ply => ply.ranking))}</td>

                <td key="6">{match.score.home}&nbsp;-&nbsp;{match.score.out}</td>
              </tr>,
              this._getMatchDetails(match)
            ];
          })}
          {!this.state.showAll ? (
            <tr key="showAll">
              <td colSpan={5} style={{textAlign: 'center'}}>
                <IconButton iconClassName="fa fa-chevron-circle-down" onClick={::this._onLoadAll} />
              </td>
            </tr>
          ) : null}
        </tbody>
      </Table>
      </div>
    );
  }
  _getFormationRankingString(rankings) {
    const diffs = _.uniq(rankings.toArray());
    return (
      <span>
        {diffs.map((ranking, index) => {
          const cnt = rankings.reduce((prev, cur) => prev + (cur === ranking ? 1 : 0), 0);
          return (
            <span key={ranking}>
              {cnt > 1 ? <small>{cnt}x</small> : null}
              {ranking}
              {index < diffs.length - 1 ? ', ' : null}
            </span>
          );
        })}
      </span>
    );
  }

  _onLoadAll() {
    this.setState({showAll: true});
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