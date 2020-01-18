import React, {Component} from 'react';
import cn from 'classnames';
import Table from 'react-bootstrap/lib/Table';
import PropTypes, {connect} from '../../PropTypes';
import {PlayerFrenoyLink} from '../PlayerCard';
import {PlayerPlayingStyleForm} from '../PlayerPlayingStyle';
import {PlayerLink} from '../../controls';

class PlayersVttlComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    filter: PropTypes.string,
  };

  render() {
    let players = this.props.players.filter(x => x.vttl);
    if (this.props.filter) {
      players = players.filter(x => x.name.toLowerCase().includes(this.props.filter));
    }
    players = players.sort((a, b) => a.vttl.position - b.vttl.position);
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{this.context.t('comp.index')}</th>
            <th>{this.context.t('comp.vttl.uniqueIndex')}</th>
            <th>{this.context.t('player.name')}</th>
            <th><span className="hidden-xs">{this.context.t('comp.ranking')}</span></th>
            <th className="hidden-xs">{this.context.t('player.style')}</th>
            <th className="hidden-xs">{this.context.t('player.bestStroke')}</th>
          </tr>
        </thead>
        <tbody>
          {players.map(ply => (
            <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
              <td>{ply.vttl.rankingIndex}</td>
              <td>{ply.vttl.uniqueIndex}</td>
              <td className="hidden-xs"><PlayerLink player={ply} /></td>
              <td className="visible-xs"><PlayerLink player={ply} alias /></td>
              <td>{ply.vttl.ranking} <PlayerFrenoyLink comp={ply.vttl} /></td>
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

export const PlayersVttl = connect(state => ({players: state.players}))(PlayersVttlComponent);
