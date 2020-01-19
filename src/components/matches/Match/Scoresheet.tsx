import React, {Component} from 'react';
import Table from 'react-bootstrap/lib/Table';
import PropTypes from '../../PropTypes';
import http from '../../../utils/httpClient';
import { ExcelButton } from '../../controls/Buttons/ExcelButton';
import { FrenoyWeekLink } from '../../controls/Buttons/FrenoyButton';
import { PlayerLink } from '../../players/controls/PlayerLink';

export default class Scoresheet extends Component {
  static propTypes = {
    match: PropTypes.MatchModel,
    t: PropTypes.func.isRequired,
    viewport: PropTypes.viewport,
  }

  render() {
    const isSmall = this.props.viewport.width < 550;
    const {competition} = this.props.match;

    if (competition === 'Sporta') {
      return [
        <ExcelButton
          key="1"
          onClick={() => http.download.scoresheetExcel(this.props.match)}
          tooltip={this.props.match.isHomeMatch ? 'Download Scoresheet' : 'Download Scoresheet (UIT match???)'}
          className={`pull-right ${this.props.match.isHomeMatch ? 'btn-success' : 'btn-danger'}`}
          style={{margin: 6}}
        />,
        <Table key="2" condensed className="match-card-tab-table">
          <thead>
            <tr>
              <th colSpan={2}><FrenoyWeekLink match={this.props.match} /></th>
              <th>{this.props.t('comp.sporta.uniqueIndex')}</th>
              <th>{this.props.t('comp.ranking')}</th>
              <th>
                {this.props.t('comp.sporta.rankingValue')}
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.match.getOwnPlayerModels().map((player, i) => {
              const comp = player.getCompetition(competition);
              return (
                <tr key={player.name}>
                  <td>{i + 1}</td>
                  <td><PlayerLink player={player} /></td>
                  <td>{comp.uniqueIndex}</td>
                  <td>{comp.ranking}</td>
                  <td>{comp.rankingValue}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={2}>&nbsp;</td>
              <td colSpan={2}>{this.props.t('comp.sporta.teamValue')}</td>
              <td>
                {this.props.match.getOwnPlayerModels()
                  .map(player => player.getCompetition(competition).rankingValue)
                  .reduce((prev, cur) => prev + cur)}
              </td>
            </tr>
          </tbody>
        </Table>,
      ];
    }
    // VTTL Scoresheet
    return (
      <Table condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th colSpan={2}>{this.props.match.frenoyMatchId}</th>
            <th>{this.props.t('comp.vttl.uniqueIndex')}</th>
            <th>{isSmall ? '' : this.props.t('comp.rankingIndex')}</th>
            <th>{isSmall ? '' : this.props.t('comp.index')}</th>
            <th>{isSmall ? '' : this.props.t('comp.ranking')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getOwnPlayerModels().map((player, i) => {
            const comp = player.getCompetition(competition);
            return (
              <tr key={player.name}>
                <td>{i + 1}</td>
                <td>{player.name}</td>
                <td>{comp.uniqueIndex}</td>
                <td>{comp.position}</td>
                <td>{comp.rankingIndex}</td>
                <td>{comp.ranking}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );

  }
}
