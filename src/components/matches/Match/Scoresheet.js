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
  }

  constructor(props) {
    super(props);
  }

  render() {
    var competition = this.props.match.getTeam().competition;

    // TODO: this is only the Sporta scoresheet, still need to do VTTL

    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th colSpan={2}>{this.props.match.frenoyMatchId}</th>
            <th>{this.props.t('match.scoresheet.uniqueIndex')}</th>
            <th>{this.props.t('match.scoresheet.ranking')}</th>
            <th>{this.props.t('match.scoresheet.rankingValue')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getOwnPlayerModels().map((player, i) => {
            var comp = player.getCompetition(competition);
            return (
              <tr key={player.name}>
                <td>{i + 1}</td>
                <td>{player.name}</td>
                <td>{comp.uniqueIndex}</td>
                <td>{comp.ranking}</td>
                <td>{comp.rankingValue}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={2}>&nbsp;</td>
            <td colSpan={2}>{this.props.t('match.scoresheet.teamValue')}</td>
            <td>
              {this.props.match.getOwnPlayerModels()
                .map(player => player.getCompetition(competition).rankingValue)
                .reduce((prev, cur) => prev + cur)
              }
            </td>
          </tr>
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