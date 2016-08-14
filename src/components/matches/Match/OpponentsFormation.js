import React, { Component } from 'react';
import PropTypes, { withViewport} from '../../PropTypes.js';

import Icon from '../../controls/Icon.js';
import Table from 'react-bootstrap/lib/Table';
import { createFrenoyLinkByUniqueId } from '../../../models/PlayerModel.js';

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
            const frenoyLink = createFrenoyLinkByUniqueId(this.props.competition, f.player.uniqueIndex);
            return (<tr key={f.player.uniqueIndex}>
              <td>
                {f.player.name}
                {frenoyLink ? <a href={frenoyLink} target="_blank" style={{marginLeft: 7}}><Icon fa="fa fa-search" /></a> : null}
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