import React, {Component} from 'react';
import PropTypes, {connect, withViewport, storeUtil} from '../../PropTypes.js';
import cn from 'classnames';
import {matchOutcome} from '../../../models/MatchModel.js';

import {TrophyIcon, FrenoyLink, PlayerLink} from '../../controls.js';
import Table from 'react-bootstrap/lib/Table';
import {OpponentPlayerLabel} from './OpponentPlayer.js';

@connect(state => ({ownPlayerId: state.user.playerId}))
export default class IndividualMatches extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
    ownPlayerId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {pinnedPlayerId: props.ownPlayerId};
  }

  render() {
    const t = this.context.t;
    var matchResult = {home: 0, out: 0};

    return (
      <Table condensed striped className="match-card-tab-table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th colSpan={2}>{t('match.individual.matchTitle')} {this.props.match.frenoyMatchId}</th>
            <th>{t('match.individual.setsTitle')}</th>
            <th>{t('match.individual.resultTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            return (
              <tr key={game.matchNumber}
                className={cn({
                  success: game.ownPlayer.playerId === this.state.pinnedPlayerId,
                  accentuate: game.ownPlayer.playerId === this.props.ownPlayerId
                })}
                onClick={this._onIndividualMatchChange.bind(this, game.ownPlayer.playerId)}
              >
                <td key="0">{game.outcome === matchOutcome.Won ? <TrophyIcon /> : null}</td>
                {!game.isDoubles ? ([
                  <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="1">{this._getPlayerDesc(game.home)}</td>,
                  <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2">{this._getPlayerDesc(game.out)}</td>
                ]) : (
                  <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2" colSpan={2}>{t('match.double')}</td>
                )}
                <td key="3">{game.homeSets}-{game.outSets}</td>
                <td key="4">{matchResult.home}-{matchResult.out}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  _getPlayerDesc(player) {
    if (!player.home) {
      return <OpponentPlayerLabel player={player} competition={this.props.match.competition} fullName={false} />;
    }

    const realPlayer = storeUtil.getPlayer(player.playerId);
    if (realPlayer) {
      return <PlayerLink player={realPlayer} />;
    }
    return player.alias;
  }

  _onIndividualMatchChange(selectedPlayerId) {
    this.setState({pinnedPlayerId: this.state.pinnedPlayerId === selectedPlayerId ? null : selectedPlayerId});
  }
}








export class ReadonlyIndividualMatches extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {pinnedPlayerIndex: null};
  }

  render() {
    const t = this.context.t;
    var matchResult = {home: 0, out: 0};

    return (
      <Table striped condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th colSpan={2}>{t('match.report.title')}</th>
            <th>{t('match.individual.setsTitle')}</th>
            <th><span className="hidden-xs">{t('match.individual.resultTitle')}</span></th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            const highlightRow = game.home.uniqueIndex === this.state.pinnedPlayerIndex || game.out.uniqueIndex === this.state.pinnedPlayerIndex;
            return (
              <tr key={game.matchNumber} className={cn({success: highlightRow})}>
                {!game.isDoubles ? ([
                  <td key="1">
                    <ReadonlyMatchPlayerLabel
                      competition={this.props.match.competition}
                      game={game}
                      homePlayer={true}
                      onClick={() => this.setState({pinnedPlayerIndex: game.home.uniqueIndex})}
                    />
                  </td>,
                  <td key="2">
                    <ReadonlyMatchPlayerLabel
                      competition={this.props.match.competition}
                      game={game}
                      homePlayer={false}
                      onClick={() => this.setState({pinnedPlayerIndex: game.out.uniqueIndex})}
                    />
                  </td>
                ]) : (
                  <td key="2" colSpan={2}>{t('match.double')}</td>
                )}
                <td key="3">{game.homeSets}-{game.outSets}</td>
                <td key="4">{matchResult.home}-{matchResult.out}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}


@withViewport
class ReadonlyMatchPlayerLabel extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    game: PropTypes.object,
    homePlayer: PropTypes.bool.isRequired,
    competition: PropTypes.string.isRequired,
    viewport: PropTypes.viewport,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const {game, homePlayer, competition, viewport, onClick} = this.props;
    const ply = homePlayer ? game.home : game.out;
    const won = (homePlayer && game.outcome === matchOutcome.Won) || (!homePlayer && game.outcome === matchOutcome.Lost);
    return (
      <span className={cn({accentuate: won})} style={{display: 'inline-block'}}>
        {won && viewport.width > 500 ? <TrophyIcon style={{marginRight: 8}} /> : null}
        <span onClick={onClick} className="clickable">
          {viewport.width > 800 ? ply.name : ply.alias}
        </span>
        &nbsp;&nbsp;
        <small>
          {viewport.width > 400 ? ply.ranking + ' ' : null}
          {viewport.width > 350 ? <FrenoyLink competition={competition} uniqueIndex={ply.uniqueIndex} /> : null}
        </small>
      </span>
    );
  }
}
