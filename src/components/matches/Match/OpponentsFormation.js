import React, { Component, PropTypes } from 'react';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withViewport from '../../../utils/decorators/withViewport.js';

import Icon from '../../controls/Icon.js';
import Table from 'react-bootstrap/lib/Table';

@withViewport
export default class OpponentsFormation extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    formations: PropTypes.array.isRequired,
    viewport: PropTypes.object.isRequired,
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
          {this.props.formations.map(f => (
            <tr key={f.player.uniqueIndex}>
              <td>{f.player.name}</td>
              <td>{f.player.ranking}</td>
              <td>{f.count}</td>
              <td>
                <Icon fa="fa fa-thumbs-o-up" style={{marginRight: 5, color: '#D3D3D3'}} />
                {f.won}
                <Icon fa="fa fa-thumbs-o-down" style={{marginRight: 5, marginLeft: 5, color: '#D3D3D3'}} />
                {f.lost}
              </td>
              <td>{(f.won / (f.lost + f.won) * 100).toFixed(0) + '%'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}