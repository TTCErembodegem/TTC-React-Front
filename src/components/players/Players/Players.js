import React, { PropTypes, Component } from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Icon from '../../controls/Icon.js';

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import PlayerModel from '../../../models/PlayerModel.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    //clubs: state.clubs,
    //matches: state.matches,
    //teams: state.teams,
  };
})
@withStyles(styles)
export default class Players extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object,
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
  };

  render() {
    // TODO: abstract this away in PlayerModel
    var baseUrlVTTLPartOne = 'http://competitie.vttl.be/index.php?menu=6&sel=';
    var baseUrlVTTLPartTwo = '&result=1';
    var baseUrlSportaPartOne = 'http://tafeltennis.sporcrea.be/competitie/index.php?menu=6&sel=';
    var baseUrlSportaPartTwo = '&result=1';
    var playersVTTL = this.props.players.filter(x => x.vttl).sort((a, b) => a.vttl.position - b.vttl.position);
    var playersSporta = this.props.players.filter(x => x.sporta).sort((a, b) => a.sporta.position - b.sporta.position);
    return (
      <Tabs>
        <Tab label={this.context.t('players.vttl')} >
         <div>
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>{this.context.t('players.index')}</th>
                <th>{this.context.t('players.vttlMemberNumber')}</th>
                <th>{this.context.t('players.name')}</th>
                <th>{this.context.t('players.ranking')}</th>
                <th>{this.context.t('players.style')}</th>
                <th>{this.context.t('players.bestStroke')}</th>
              </tr>
            </thead>
            <tbody>
              {playersVTTL.map(ply => (<tr key={ply.id}>
                <td>{ply.vttl.rankingIndex}</td>
                <td>{ply.vttl.uniqueIndex}</td>
                <td>{ply.name}</td>
                <td>
                  {ply.vttl.ranking}&nbsp;
                  <a href={baseUrlVTTLPartOne + ply.vttl.frenoyLink + baseUrlVTTLPartTwo} target="_blank">
                  <Icon fa="fa fa-search" /></a>
                </td>
                <td>{ply.style.name}</td>
                <td>{ply.style.bestStroke}</td></tr>))}
            </tbody>
          </table>
          </div>
        </Tab>
        <Tab label={this.context.t('players.sporta')} >
          <div>
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>{this.context.t('players.index')}</th>
                  <th>{this.context.t('players.vttlMemberNumber')}</th>
                  <th>{this.context.t('players.name')}</th>
                  <th>{this.context.t('players.ranking')}</th>
                  <th>{this.context.t('players.value')}</th>
                  <th>{this.context.t('players.style')}</th>
                  <th>{this.context.t('players.bestStroke')}</th>
                </tr>
              </thead>
              <tbody>
                {playersSporta.map(ply => (<tr key={ply.id}>
                  <td>{ply.sporta.rankingIndex}</td>
                  <td>{ply.sporta.uniqueIndex}</td>
                  <td>{ply.name}</td>
                  <td>
                  {ply.sporta.ranking}&nbsp;
                  <a href={baseUrlSportaPartOne + ply.sporta.frenoyLink + baseUrlSportaPartTwo} target="_blank">
                  <Icon fa="fa fa-search" /></a>
                  </td>
                  <td>{ply.sporta.rankingValue}</td>
                  <td>{ply.style.name}</td>
                  <td>{ply.style.bestStroke}</td></tr>))}
              </tbody>
            </table>
          </div>
        </Tab>
      </Tabs>
    );
  }
}