import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes.js';
import {getRankingValue} from '../../../models/utils/playerRankingValueMapper.js';

//import {Icon} from '../../controls.js';
import Table from 'react-bootstrap/lib/Table';
import {PlayerRankings, getMatchPlayerRankings} from '../controls/MatchPlayerRankings.js';

@withViewport
export class OpponentsTeamFormation extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
    matches: PropTypes.MatchModelList.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
  }

  render() {
    const {matches, opponent} = this.props;

    const createKey = form => form.reduce((key, f) => key + f.amount + f.ranking, '');

    const formations = matches.filter(match => match.isSyncedWithFrenoy).reduce((acc, match) => {
      const isHomeTeam = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
      const formation = getMatchPlayerRankings(match, isHomeTeam);

      const exists = acc.find(form => form.key === createKey(formation));
      if (!exists) {
        acc.push({
          key: createKey(formation),
          details: formation,
          amount: 1,
          value: formation.reduce((total, {ranking, amount}) => total + (amount * getRankingValue(match.competition, ranking)), 0),
        });

      } else {
        exists.amount++;
      }
      return acc;
    }, []);

    const t = this.context.t;
    return (
      <Table condensed striped style={{maxWidth: 250}}>
        <thead>
          <tr>
            <th colSpan={2}>{t('common.teamFormation')}</th>
            <th style={{width: 80}}>{t('comp.sporta.rankingValue')}</th>
          </tr>
        </thead>
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
