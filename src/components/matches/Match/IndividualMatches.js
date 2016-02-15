import React, { PropTypes, Component } from 'react';

import { matchOutcome } from '../../../models/MatchModel.js';
import MatchModel from '../../../models/MatchModel.js';

import Icon from '../../controls/Icon.js';
import Table from 'react-bootstrap/lib/Table';
import cn from 'classnames';

export default class IndividualMatches extends Component {
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel),
    t: PropTypes.func.isRequired,
    ownPlayerId: PropTypes.number
  }

  constructor(props) {
    super(props);

    this.state = {
      //hoverPlayerId: null,
      pinnedPlayerId: props.ownPlayerId
    };
  }

  render() {
    var matchResult = {
      home: 0,
      out: 0
    };

    return (
      <Table condensed className="match-card-tab-individual-matches">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th colSpan={2}>{this.props.t('match.individual.matchTitle')}</th>
            <th>{this.props.t('match.individual.setsTitle')}</th>
            <th>{this.props.t('match.individual.resultTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            return (
              <tr key={game.matchNumber}
                className={cn({
                  success: this._isMarkedPlayer(game.ownPlayer.playerId),
                  accentuate: game.ownPlayer.playerId === this.props.ownPlayerId
                })}
                //onMouseOver={this._onIndividualMatchHover.bind(this, game.ownPlayer.playerId)}
                onClick={this._onIndividualMatchChange.bind(this, game.ownPlayer.playerId)}>
                <td>{this._getVictoryIcon(game)}</td>
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})}>{this._getPlayerDesc(game.home)}</td>
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})}>{this._getPlayerDesc(game.out)}</td>
                <td>{`${game.homeSets}-${game.outSets}`}</td>
                <td>{`${matchResult.home}-${matchResult.out}`}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  _isMarkedPlayer(playerId) {
    return playerId === this.state.pinnedPlayerId; // || (!this.state.pinnedPlayerId && playerId === this.state.hoverPlayerId);
  }

  _getPlayerDesc(player) {
    if (!player.home) {
      return `${player.alias} (${player.ranking})`;
    }
    return player.alias;
  }

  _getVictoryIcon(game) {
    if (game.outcome === matchOutcome.Won) {
      return <Icon fa="fa fa-trophy" color="#FCB514" />;
    }
  }

  // _onIndividualMatchHover(selectedPlayerId) {
  //   this.setState({hoverPlayerId: selectedPlayerId});
  // }
  _onIndividualMatchChange(selectedPlayerId) {
    this.setState({pinnedPlayerId: this.state.pinnedPlayerId === selectedPlayerId ? null : selectedPlayerId});
  }
}