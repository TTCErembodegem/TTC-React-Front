import React, { PropTypes, Component } from 'react';
import Icon from '../../controls/Icon.js';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';
import PlayerImage from '../PlayerImage.js';
import TabbedContainer from '../../controls/TabbedContainer.js';
import Table from 'react-bootstrap/lib/Table';
import cn from 'classnames';
import TextField from 'material-ui/lib/text-field';

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import PlayerModel, { createFrenoyLink } from '../../../models/PlayerModel.js';
import TeamModel from '../../../models/TeamModel.js';
import { util as storeUtil } from '../../../store.js';
import http from '../../../utils/httpClient.js';
import moment from 'moment';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

const tabEventKeys = {
  all: 1,
  vttl: 2,
  sporta: 3,
};

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    //clubs: state.clubs,
    //matches: state.matches,
    teams: state.teams,
    user: state.user,
  };
})
@withStyles(styles)
export default class Players extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object,
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    teams: ImmutablePropTypes.listOf(PropTypes.instanceOf(TeamModel).isRequired).isRequired,
    user: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {filter: ''};
  }

  _downloadExcel() {
    http.download('/players/ExcelExport').then(res => {
      var link = document.createElement('a');
      link.download = this.context.t('players.downloadExcelFileName', moment().format('YYYY-MM-DD')) + '.xlsx';
      link.href = 'data:application/octet-stream;base64,' + res.body;
      link.click();
    })
    .catch(err => {
      console.error('err', err);
    });
  }

  _onPlayerSearchChange(e) {
    this.setState({filter: e.target.value.toLowerCase()});
  }
  _renderToolbar(tabKey) {
    return (
      <div style={{marginRight: 5, marginLeft: 5}}>
        {tabKey !== tabEventKeys.all ? (
          <TextField hintText={this.context.t('players.search')} onChange={::this._onPlayerSearchChange} style={{width: 150}} />
        ) : null}

        {this.props.user.playerId ? (
          <a onClick={::this._downloadExcel} title={this.context.t('players.downloadExcel')} className="clickable pull-right" style={{marginTop: 5}}>
            <Icon fa="fa fa-file-excel-o fa-2x" />
          </a>
        ) : null}
      </div>
    );
  }
  _renderTabContent(tabKey) {
    var tabContent;
    switch (tabKey) {
    case tabEventKeys.all:
      tabContent = this._renderTabAll();
      break;
    case tabEventKeys.vttl:
      tabContent = this._renderTabVttl();
      break;
    case tabEventKeys.sporta:
      tabContent = this._renderTabSporta();
      break;
    }
    return (
      <div>
        <div>{this._renderToolbar(tabKey)}</div>
        {tabContent}
      </div>
    );
  }

  _renderTabAll() {
    return (
      <div style={{marginBottom: -20, marginLeft: 10, marginRight: 10}}>
        <Accordion>
          {this.props.teams.sort((a, b) => (a.competition + a.teamCode).localeCompare(b.competition + b.teamCode)).map((team, index) => (
            <Panel key={team.id} header={team.competition + ' ' + team.teamCode + '-' + this.context.t('players.team')} eventKey={index}>
              {this._getPlayersOfTeam(team.competition,team.teamCode)}
            </Panel>
          ))}
        </Accordion>
      </div>
    );
  }
  _renderTabVttl() {
    var playersVTTL = this.props.players.filter(x => x.vttl);
    if (this.state.filter) {
      playersVTTL = playersVTTL.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }
    playersVTTL = playersVTTL.sort((a, b) => a.vttl.position - b.vttl.position);
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{this.context.t('players.index')}</th>
            <th>{this.context.t('players.memberNumber')}</th>
            <th>{this.context.t('players.name')}</th>
            <th><span className="hidden-xs">{this.context.t('players.ranking')}</span></th>
            <th className="hidden-xs">{this.context.t('players.style')}</th>
            <th className="hidden-xs">{this.context.t('players.bestStroke')}</th>
          </tr>
        </thead>
        <tbody>
          {playersVTTL.map(ply => (
            <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
              <td>{ply.vttl.rankingIndex}</td>
              <td>{ply.vttl.uniqueIndex}</td>
              <td className="hidden-xs">{ply.name}</td>
              <td className="visible-xs">{ply.alias}</td>
              <td>{this._renderCompetitionRanking(ply.vttl)}</td>
              <td className="hidden-xs">{ply.style.name}</td>
              <td className="hidden-xs">{ply.style.bestStroke}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  _renderTabSporta() {
    var playersSporta = this.props.players.filter(x => x.sporta);
    if (this.state.filter) {
      playersSporta = playersSporta.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }
    playersSporta = playersSporta.sort((a, b) => a.sporta.position - b.sporta.position);
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{this.context.t('players.index')}</th>
            <th>{this.context.t('players.memberNumber')}</th>
            <th>{this.context.t('players.name')}</th>
            <th><span className="hidden-xs">{this.context.t('players.ranking')}</span></th>
            <th>{this.context.t('players.value')}</th>
            <th className="hidden-xs">{this.context.t('players.style')}</th>
            <th className="hidden-xs">{this.context.t('players.bestStroke')}</th>
          </tr>
        </thead>
        <tbody>
          {playersSporta.map(ply => (
            <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
              <td>{ply.sporta.rankingIndex}</td>
              <td>{ply.sporta.uniqueIndex}</td>
              <td className="hidden-xs">{ply.name}</td>
              <td className="visible-xs">{ply.alias}</td>
              <td>{this._renderCompetitionRanking(ply.sporta)}</td>
              <td>{ply.sporta.rankingValue}</td>
              <td className="hidden-xs">{ply.style.name}</td>
              <td className="hidden-xs">{ply.style.bestStroke}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  _renderCompetitionRanking(comp) {
    return (
      <span>
        {comp.ranking}
        &nbsp;
        <a href={createFrenoyLink(comp)} target="_blank">
          <Icon fa="fa fa-search" />
        </a>
      </span>
    );
  }

  render() {
    const tabConfig = [{
      key: tabEventKeys.all,
      title: this.context.t('players.all'),
    }, {
      key: tabEventKeys.vttl,
      title: this.context.t('players.vttl'),
    }, {
      key: tabEventKeys.sporta,
      title: this.context.t('players.sporta'),
    }];

    return (
      <div style={{marginTop: 20, marginBottom: 10}}>
        <TabbedContainer
          openTabKey={tabEventKeys.all}
          tabKeys={tabConfig}
          tabRenderer={::this._renderTabContent}
          forceTabs />
      </div>
    );
  }

  _getPlayersOfTeam(competition, team) {
    const teamTT = this.props.teams.filter(x => x.competition === competition && x.teamCode === team).toArray();
    const players = teamTT[0].players;
    var playerAsPlayerObject= [];
    for (let i = 0; i < players.length; i++){
      playerAsPlayerObject.push(storeUtil.getPlayer(players[i].playerId));
    }
    if (competition === 'Vttl') {
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
    } else {
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



  _getPlayerRoleInTeam(players, playerId) {
    const iconWidth = {
      width: 26
    };

    for (let i = 0; i < players.length; i++){
      if (players[i].playerId === playerId) {
        if (players[i].type === 'Captain') {
          return (
            <span style={iconWidth}>
              <Icon fa="fa fa-star fa-2x" />
            </span>
          );
        } else if (players[i].type === 'Reserve') {
          return (
            <span style={iconWidth}>
              <Icon fa="fa fa-user-times fa-2x" />
            </span>
          );
        } else {
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