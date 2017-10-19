import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes.js';

import {Icon, FrenoyLink} from '../../controls.js';
import Table from 'react-bootstrap/lib/Table';

@withViewport
export default class OpponentsFormation extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    formations: PropTypes.array.isRequired,
    viewport: PropTypes.viewport,
    competition: PropTypes.competition.isRequired,
  }

  render() {
    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th>{this.context.t('match.opponents.player')}</th>
            <th>{this.context.t('match.opponents.playerRanking')}</th>
            <th>{this.props.viewport.width > 600 ? this.context.t('match.opponents.timesPlayed') : null}</th>
            <th colSpan={2}>{this.context.t('match.opponents.victories')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.formations.map(f => {
            return (<tr key={f.player.uniqueIndex}>
              <td>
                <span style={{marginRight: 7}}>{f.player.name}</span>
                <FrenoyLink competition={this.props.competition} uniqueIndex={f.player.uniqueIndex} />
              </td>
              <td>{f.player.ranking}</td>
              <td>{f.count}</td>
              <td>
                <Icon fa="fa fa-thumbs-o-up" style={{marginRight: 5, color: '#D3D3D3'}} />
                {f.won}
                <Icon fa="fa fa-thumbs-o-down" style={{marginRight: 5, marginLeft: 5, color: '#D3D3D3'}} />
                {f.lost}
              </td>
              <td>{(f.won / (f.lost + f.won) * 100).toFixed(0) + '%'}</td>
            </tr>);
          })}
        </tbody>
      </Table>
    );
  }
}
