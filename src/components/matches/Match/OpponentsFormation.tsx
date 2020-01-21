import React, {Component} from 'react';
import Table from 'react-bootstrap/lib/Table';
import PropTypes, {withViewport, storeUtil} from '../../PropTypes';
import {OpponentPlayerLabel} from './OpponentPlayer';
import {Spinner} from '../../controls/controls/Spinner';
import {ThumbsUpIcon, ThumbsDownIcon} from '../../controls/Icons/ThumbsIcons';
import {ITeamOpponent, Viewport, IMatch} from '../../../models/model-interfaces';

type OpponentsFormationProps = {
  viewport: Viewport,
  match: IMatch,
  opponent: ITeamOpponent,
}

class OpponentsFormation extends Component<OpponentsFormationProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    const formations = storeUtil.matches
      .getFormation(this.props.match, this.props.opponent)
      .sort((a, b) => (a.count < b.count ? 1 : -1));

    if (formations.length === 0) {
      return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    }

    const showTimesPlayed = this.props.viewport.width > 600;

    return (
      <Table condensed striped className="match-card-tab-table">
        <thead>
          <tr>
            <th>{this.context.t('match.opponents.player')}</th>
            {showTimesPlayed ? <th>{this.context.t('match.opponents.timesPlayed')}</th> : null}
            <th colSpan={2}>{this.context.t('match.opponents.victories')}</th>
          </tr>
        </thead>
        <tbody>
          {formations.map(f => (
            <tr key={f.player.uniqueIndex}>
              <td>
                <OpponentPlayerLabel player={f.player} competition={this.props.match.competition} />
              </td>
              {showTimesPlayed ? <td>{f.count}</td> : null}
              <td>
                <ThumbsUpIcon />
                {f.won}

                <ThumbsDownIcon style={{marginLeft: 8}} />
                {f.lost}
              </td>
              <td>{`${(f.won / (f.lost + f.won) * 100).toFixed(0)}%`}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default withViewport(OpponentsFormation);
