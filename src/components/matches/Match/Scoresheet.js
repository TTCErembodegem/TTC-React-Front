import React, { PropTypes, Component } from 'react';

//import { matchOutcome } from '../../../models/MatchModel.js';
import MatchModel from '../../../models/MatchModel.js';

//import Icon from '../../controls/Icon.js';
import Table from 'react-bootstrap/lib/Table';
//import cn from 'classnames';

export default class Scoresheet extends Component {
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel),
    t: PropTypes.func.isRequired,
  }

  render() {
    var competition = this.props.match.getTeam().competition;

    if (competition === 'Sporta') {
      return (
        <Table condensed className="match-card-tab-table">
          <thead>
            <tr>
              <th colSpan={2}>{this.props.match.frenoyMatchId}</th>
              <th>{this.props.t('match.scoresheetSporta.uniqueIndex')}</th>
              <th>{this.props.t('match.scoresheetSporta.ranking')}</th>
              <th>{this.props.t('match.scoresheetSporta.rankingValue')}</th>
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
              <td colSpan={2}>{this.props.t('match.scoresheetSporta.teamValue')}</td>
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
    } else {
      // VTTL Scoresheet
      return (
        <Table condensed className="match-card-tab-table">
          <thead>
            <tr>
              <th colSpan={2}>{this.props.match.frenoyMatchId}</th>
              <th>{this.props.t('match.scoresheetVttl.uniqueIndex')}</th>
              <th>{this.props.t('match.scoresheetVttl.rankingIndex')}</th>
              <th>{this.props.t('match.scoresheetVttl.index')}</th>
              <th>{this.props.t('match.scoresheetVttl.ranking')}</th>
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
}