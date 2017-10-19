import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import cn from 'classnames';
import {matchOutcome} from '../../../models/MatchModel.js';
import OpponentPlayer from './OpponentPlayer.js';
import {FrenoyLink} from './OpponentsFormation.js';

import {TrophyIcon} from '../../controls/Icon.js';
import Table from 'react-bootstrap/lib/Table';

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
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th colSpan={2}>{t('match.individual.matchTitle')}</th>
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
                <td key="3">{`${game.homeSets}-${game.outSets}`}</td>
                <td key="4">{`${matchResult.home}-${matchResult.out}`}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  _getPlayerDesc(player) {
    if (!player.home) {
      return `${player.alias} (${player.ranking})`;
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
    this.state = {pinnedPlayerId: null};
  }

  render() {
    const t = this.context.t;
    var matchResult = {home: 0, out: 0};

    return (
      <Table striped condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th colSpan={2}>{t('match.individual.matchTitle')}</th>
            <th>{t('match.individual.setsTitle')}</th>
            <th>{t('match.individual.resultTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            return (
              <tr key={game.matchNumber}
                className={cn({success: false === this.state.pinnedPlayerId})}
              >
                {!game.isDoubles ? ([
                  <td key="1">
                    <ReadonlyMatchPlayerLabel
                      competition={this.props.match.competition}
                      game={game}
                      homePlayer={true}
                    />
                  </td>,
                  <td key="2">
                    <ReadonlyMatchPlayerLabel
                      competition={this.props.match.competition}
                      game={game}
                      homePlayer={false}
                    />
                  </td>
                ]) : (
                  <td key="2" colSpan={2}>{t('match.double')}</td>
                )}
                <td key="3">{`${game.homeSets}-${game.outSets}`}</td>
                <td key="4">{`${matchResult.home}-${matchResult.out}`}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}



class ReadonlyMatchPlayerLabel extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    game: PropTypes.object,
    homePlayer: PropTypes.bool.isRequired,
    competition: PropTypes.string.isRequired,
  };

  render() {
    const {game, homePlayer, competition} = this.props;
    const ply = homePlayer ? game.home : game.out;
    const won = (homePlayer && game.outcome === matchOutcome.Won) || (!homePlayer && game.outcome === matchOutcome.Lost);
    return (
      <span className={cn({accentuate: won})} style={{display: 'inline-block'}}>
        {won ? <TrophyIcon style={{marginRight: 8}} /> : null}
        {ply.name}
        &nbsp;&nbsp;
        <small>
          {ply.ranking + ' '}
          <FrenoyLink competition={competition} uniqueIndex={ply.uniqueIndex} />
        </small>
      </span>
    );
  }
}
