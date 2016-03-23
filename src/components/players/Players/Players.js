import React, { PropTypes, Component } from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Icon from '../../controls/Icon.js';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import PlayerModel from '../../../models/PlayerModel.js';
import TeamModel from '../../../models/TeamModel.js';
import { util as storeUtil } from '../../../store.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    //clubs: state.clubs,
    //matches: state.matches,
    teams: state.teams,
  };
})
@withStyles(styles)
export default class Players extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object,
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    teams: ImmutablePropTypes.listOf(PropTypes.instanceOf(TeamModel).isRequired).isRequired,
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
      <Tabs style={{marginTop: 10}}>
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
        <Tab label={this.context.t('players.alle')}>
          <Accordion style={{marginTop: 10}}>
            <Panel header={this.context.t('players.vttlTeamA')} eventKey="1">
              {this._getPlayersOfTeam('Vttl','A')}
            </Panel>
            <Panel header={this.context.t('players.vttlTeamB')} eventKey="2">
              {this._getPlayersOfTeam('Vttl','B')}
            </Panel>
            <Panel header={this.context.t('players.vttlTeamC')} eventKey="3">
              {this._getPlayersOfTeam('Vttl','C')}
            </Panel>
            <Panel header={this.context.t('players.vttlTeamD')} eventKey="4">
              {this._getPlayersOfTeam('Vttl','D')}
            </Panel>
            <Panel header={this.context.t('players.vttlTeamE')} eventKey="5">
              {this._getPlayersOfTeam('Vttl','E')}
            </Panel>
            <Panel header={this.context.t('players.vttlTeamF')} eventKey="6">
              {this._getPlayersOfTeam('Vttl','F')}
            </Panel>
            <Panel header={this.context.t('players.sportaTeamA')} eventKey="7">
              {this._getPlayersOfTeam('Sporta','A')}
            </Panel>
            <Panel header={this.context.t('players.sportaTeamB')} eventKey="8">
              {this._getPlayersOfTeam('Sporta','B')}
            </Panel>
            <Panel header={this.context.t('players.sportaTeamC')} eventKey="9">
              {this._getPlayersOfTeam('Sporta','C')}
            </Panel>
            <Panel header={this.context.t('players.sportaTeamD')} eventKey="10">
              {this._getPlayersOfTeam('Sporta','D')}
            </Panel>
            <Panel header={this.context.t('players.sportaTeamE')} eventKey="11">
              {this._getPlayersOfTeam('Sporta','E')}
            </Panel>
            <Panel header={this.context.t('players.sportaTeamF')} eventKey="12">
              {this._getPlayersOfTeam('Sporta','F')}
            </Panel>
          </Accordion>
        </Tab>
      </Tabs>
    );
  }

  _getPlayersOfTeam(competition,team){
    var team = this.props.teams.filter(x => x.competition === competition && x.teamCode === team).toArray();
    var spelers = team[0].players;
    var spelersAsPlayerObject = [];
    for (var i = 0; i < spelers.length; i++){
       spelersAsPlayerObject.push(storeUtil.getPlayer(spelers[i].playerId));
    }
    if (competition === 'Vttl')
    {
      spelersAsPlayerObject = spelersAsPlayerObject.filter(x => x.vttl).sort((a, b) => a.vttl.position - b.vttl.position);
      return (
        <div>
          {spelersAsPlayerObject.map(speler => (<Card key={speler.id}>
          <CardHeader title={this.context.t('players.vttl') + ' ' + team[0].teamCode + ' - ' + speler.name} />} />
             <CardText>
                 <p>{this.context.t('players.indexVTTL')} {speler.vttl.rankingIndex}</p>
                 <p>{this.context.t('players.memberNumberVTTL')} {speler.vttl.uniqueIndex}</p>
                 <p>{this.context.t('players.rankingVTTL')} {speler.vttl.ranking}</p>
                 <p>{this.context.t('players.styleAll')} {speler.style.name}</p>
                 <p>{this.context.t('players.bestStrokeAll')} {speler.style.bestStroke}</p>
             </CardText>
          </Card>))}
        </div>
      );
    }
    else
    {
      spelersAsPlayerObject = spelersAsPlayerObject.filter(x => x.sporta).sort((a, b) => a.sporta.position - b.sporta.position);
      return (
        <div>
          {spelersAsPlayerObject.map(speler => (<Card key={speler.id}>
          <CardHeader title={this.context.t('players.sporta') + ' ' + team[0].teamCode + ' - ' + speler.name} />} />
             <CardText>
                 <p>{this.context.t('players.indexSporta')} {speler.sporta.rankingIndex}</p>
                 <p>{this.context.t('players.memberNumberSporta')} {speler.sporta.uniqueIndex}</p>
                 <p>{this.context.t('players.rankingSporta')} {speler.sporta.ranking}</p>
                 <p>{this.context.t('players.styleAll')} {speler.style.name}</p>
                 <p>{this.context.t('players.bestStrokeAll')} {speler.style.bestStroke}</p>
             </CardText>
          </Card>))}
        </div>
      );
    }
  }
}