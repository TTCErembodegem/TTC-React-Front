import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import cn from 'classnames';
import Table from 'react-bootstrap/lib/Table';

import {Telephone, Icon, Email, ExcelButton} from '../../controls.js';
import {PlayerFrenoyLink} from '../PlayerCard.js';
import {PlayerPlayingStyleForm} from "../PlayerPlayingStyle.js";


@connect(state => ({players: state.players}))
export class PlayersSporta extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    filter: PropTypes.string,
  };

  render() {
    var players = this.props.players.filter(x => x.sporta);
    if (this.props.filter) {
      players = players.filter(x => x.name.toLowerCase().includes(this.props.filter));
    }
    players = players.sort((a, b) => a.sporta.position - b.sporta.position);

    // Sorting as required by the Sporta scoresheet Excel
    //players = players.sort((a, b) => a.name.localeCompare(b.name));
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{this.context.t('comp.index')}</th>
            <th>{this.context.t('comp.sporta.uniqueIndex')}</th>
            <th>{this.context.t('player.name')}</th>
            <th><span className="hidden-xs">{this.context.t('comp.ranking')}</span></th>
            <th>{this.context.t('comp.sporta.rankingValue')}</th>
            <th className="hidden-xs">{this.context.t('player.style')}</th>
            <th className="hidden-xs">{this.context.t('player.bestStroke')}</th>
          </tr>
        </thead>
        <tbody>
          {players.map(ply => (
            <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
              <td>{ply.sporta.rankingIndex}</td>
              <td>{ply.sporta.uniqueIndex}</td>
              <td className="hidden-xs">{ply.name}</td>
              <td className="visible-xs">{ply.alias}</td>
              <td>{ply.sporta.ranking} <PlayerFrenoyLink comp={ply.sporta} /></td>
              <td>{ply.sporta.rankingValue}</td>
              <td className="hidden-xs">{ply.style.name}</td>
              <td className="hidden-xs">
                <PlayerPlayingStyleForm player={ply} iconStyle="edit-icon" style={{color: '#d3d3d3', float: 'right'}} />
                {ply.style.bestStroke}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
