import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';
import PropTypes, {withViewport} from '../../PropTypes';
import {getOpponentFormations} from '../../../storeUtil';
import {PlayerRankings} from '../controls/MatchPlayerRankings';


class OpponentsTeamFormationComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    viewport: PropTypes.viewport,
    matches: PropTypes.MatchModelList.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
    hideHeader: PropTypes.bool,
  }

  render() {
    const {matches, opponent} = this.props;
    const formations = getOpponentFormations(matches, opponent);

    const {t} = this.context;
    return (
      <Table condensed striped style={{maxWidth: 250}}>
        {!this.props.hideHeader ? (
          <thead>
            <tr>
              <th colSpan={2}>{t('common.teamFormation')}</th>
              <th style={{width: 80}}>{t('comp.sporta.rankingValue')}</th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {formations.sort((a, b) => b.value - a.value).map(formation => (
            <tr key={formation.key}>
              <td>{formation.amount}x</td>

              <td>
                <PlayerRankings formation={formation.details} />
              </td>

              <td>{formation.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export const OpponentsTeamFormation = withViewport(OpponentsTeamFormationComponent);
