import React, { PropTypes, Component } from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Icon from '../../controls/Icon.js';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';
import PlayerImage from '../PlayerImage.js';

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import PlayerModel, { createFrenoyLink } from '../../../models/PlayerModel.js';
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
                  <a href={createFrenoyLink(ply.vttl)} target="_blank">
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
                  <a href={createFrenoyLink(ply.sporta)} target="_blank">
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
          <Accordion style={{marginTop: 10, marginBottom: 10}}>
            {this.props.teams.sort((a, b) => (a.competition + a.teamCode).localeCompare(b.competition + b.teamCode))
                .map((team, index) => <Panel header={team.competition + ' ' + team.teamCode + '-' +  this.context.t('players.team')}
                  eventKey={index}>
              {this._getPlayersOfTeam(team.competition,team.teamCode)}
            </Panel>)}
          </Accordion>
        </Tab>
      </Tabs>
    );
  }

  _getPlayersOfTeam(competition,team){
    var teamTT = this.props.teams.filter(x => x.competition === competition && x.teamCode === team).toArray();
    var players = teamTT[0].players;
    var playerAsPlayerObject = [];
    for (var i = 0; i < players.length; i++){
       playerAsPlayerObject.push(storeUtil.getPlayer(players[i].playerId));
    }
    if (competition === 'Vttl')
    {
      playerAsPlayerObject = playerAsPlayerObject.filter(x => x.vttl).sort((a, b) => a.vttl.position - b.vttl.position);
      return (
        <div>
            {playerAsPlayerObject.map(player => (<Card key={player.id}>
            <CardHeader title={this.context.t('players.vttl') + ' ' + teamTT[0].teamCode + ' - ' + player.name}
            avatar={this._getPlayerRoleInTeam(players,player.id)} />
               <CardText>
                   <div className="row">
                      <div className="col-sm-8">
                         <p>{this.context.t('players.indexVTTL')} {player.vttl.rankingIndex}</p>
                         <p>{this.context.t('players.memberNumberVTTL')} {player.vttl.uniqueIndex}</p>
                         <p>{this.context.t('players.rankingVTTL')} {player.vttl.ranking}</p>
                         <p>{this.context.t('players.styleAll')} {player.style.name}</p>
                         <p>{this.context.t('players.bestStrokeAll')} {player.style.bestStroke}</p>
                      </div>
                      <div className="col-sm-4">
                        <PlayerImage playerId={player.id} />
                      </div>
                    </div>
               </CardText>
            </Card>))}
        </div>
      );
    }
    else
    {
      playerAsPlayerObject = playerAsPlayerObject.filter(x => x.sporta).sort((a, b) => a.sporta.position - b.sporta.position);
      return (
        <div>
          {playerAsPlayerObject.map(player => (<Card key={player.id}>
          <CardHeader title={this.context.t('players.sporta') + ' ' + teamTT[0].teamCode + ' - ' + player.name}
          avatar={this._getPlayerRoleInTeam(players,player.id)} />
             <CardText>
                 <div className="row">
                      <div className="col-sm-8">
                         <p>{this.context.t('players.indexSporta')} {player.sporta.rankingIndex}</p>
                         <p>{this.context.t('players.memberNumberSporta')} {player.sporta.uniqueIndex}</p>
                         <p>{this.context.t('players.rankingSporta')} {player.sporta.ranking}</p>
                         <p>{this.context.t('players.styleAll')} {player.style.name}</p>
                         <p>{this.context.t('players.bestStrokeAll')} {player.style.bestStroke}</p>
                      </div>
                      <div className="col-sm-4">
                         <PlayerImage playerId={player.id} />
                      </div>
                 </div>
             </CardText>
          </Card>))}
        </div>
      );
    }
  }



  _getPlayerRoleInTeam(players,playerId){
    var iconWidth = {
      width: 26
    };

    for (var i = 0; i < players.length; i++){
      if (players[i].playerId === playerId) {
         if (players[i].type === 'Captain') {
            return (
              <span style={iconWidth}>
                <Icon fa="fa fa-star fa-2x" />
              </span>
            );
         }
         else if (players[i].type === 'Reserve') {
            return (
              <span style={iconWidth}>
                <Icon fa="fa fa-user-times fa-2x" />
              </span>
            );
         }
         else {
            return (
              <span style={iconWidth}>
                <Icon fa="fa fa-user-plus fa-2x" />
              </span>
            );
         }
      }
    }
  }
}