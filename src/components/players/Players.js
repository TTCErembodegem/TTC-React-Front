import React, { Component } from 'react';
import PropTypes, { connect, withViewport, keyMirror } from '../PropTypes.js';
import cn from 'classnames';
import moment from 'moment';
import http from '../../utils/httpClient.js';

import Table from 'react-bootstrap/lib/Table';
import TextField from 'material-ui/TextField';

import TabbedContainer from '../controls/TabbedContainer.js';
import { Telephone, Icon, Email } from '../controls.js';
import { PlayerCompetition, PlayerFrenoyLink } from './PlayerCard.js';
import PlayersCardGallery from './PlayersCardGallery.js';

const tabEventKeys = keyMirror({
  all: '',
  vttl: '',
  sporta: '',
  gallery: '',
});

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    teams: state.teams,
    user: state.user,
  };
})
@withViewport
export default class Players extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    players: PropTypes.PlayerModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
    viewport: PropTypes.viewport,

    params: PropTypes.shape({
      tabKey: PropTypes.string
    }),
  };

  constructor(props) {
    super(props);
    this.state = {filter: ''};
  }

  _downloadExcel() {
    if (this.state.isDownloading) {
      return;
    }
    this.setState({isDownloading: true});
    http.download.playersExcel(this.context.t('players.downloadExcelFileName'))
      .catch(err => {
        console.error('err', err);
      })
      .delay(2000)
      .then(() => this.setState({isDownloading: false}));
  }

  _renderToolbar(activeTab) {
    var marginLeft = 5;
    if (activeTab === tabEventKeys.gallery) {
      marginLeft = this.props.viewport.width > 450 ? 25 : 10;
    }
    return (
      <div style={{marginRight: 5, marginLeft: marginLeft}}>
        <TextField
          hintText={this.context.t('players.search')}
          onChange={e => this.setState({filter: e.target.value.toLowerCase()})}
          style={{width: 150}} />
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
    case tabEventKeys.gallery:
      tabContent = this._renderTabGallery();
      break;
    }
    return (
      <div>
        <div>{this._renderToolbar(tabKey)}</div>
        {tabContent}
      </div>
    );
  }

  _renderTabVttl() {
    var players = this.props.players.filter(x => x.vttl);
    if (this.state.filter) {
      players = players.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }
    players = players.sort((a, b) => a.vttl.position - b.vttl.position);
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{this.context.t('comp.index')}</th>
            <th>{this.context.t('comp.vttl.uniqueIndex')}</th>
            <th>{this.context.t('player.name')}</th>
            <th><span className="hidden-xs">{this.context.t('comp.ranking')}</span></th>
            <th className="hidden-xs">{this.context.t('player.style')}</th>
            <th className="hidden-xs">{this.context.t('player.bestStroke')}</th>
          </tr>
        </thead>
        <tbody>
          {players.map(ply => (
            <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
              <td>{ply.vttl.rankingIndex}</td>
              <td>{ply.vttl.uniqueIndex}</td>
              <td className="hidden-xs">{ply.name}</td>
              <td className="visible-xs">{ply.alias}</td>
              <td>{ply.vttl.ranking} <PlayerFrenoyLink comp={ply.vttl} /></td>
              <td className="hidden-xs">{ply.style.name}</td>
              <td className="hidden-xs">{ply.style.bestStroke}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  _renderTabSporta() {
    var players = this.props.players.filter(x => x.sporta);
    if (this.state.filter) {
      players = players.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }
    players = players.sort((a, b) => a.sporta.position - b.sporta.position);
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{this.context.t('comp.index')}</th>
            <th>{this.context.t('comp.sporta.uniqueIndex')}</th>
            <th>{this.context.t('player.name')}</th>
            <th><span className="hidden-xs">{this.context.t('comp.ranking')}</span></th>
            <th>{this.context.t('comp.sporta.rankingValue')}</th>
            <th className="hidden-xs">{this.context.t('player.style')}</th>
            <th className="hidden-xs">{this.context.t('player.bestStroke')}</th>
          </tr>
        </thead>
        <tbody>
          {players.map(ply => (
            <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
              <td>{ply.sporta.rankingIndex}</td>
              <td>{ply.sporta.uniqueIndex}</td>
              <td className="hidden-xs">{ply.name}</td>
              <td className="visible-xs">{ply.alias}</td>
              <td>{ply.sporta.ranking} <PlayerFrenoyLink comp={ply.sporta} /></td>
              <td>{ply.sporta.rankingValue}</td>
              <td className="hidden-xs">{ply.style.name}</td>
              <td className="hidden-xs">{ply.style.bestStroke}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  render() {
    const tabKeysConfig = [{
      key: tabEventKeys.all,
      title: this.context.t('players.all'),
    }, {
      key: tabEventKeys.vttl,
      title: 'Vttl',
    }, {
      key: tabEventKeys.sporta,
      title: 'Sporta',
    }, {
      key: tabEventKeys.gallery,
      title: this.context.t('players.gallery'),
    }];

    return (
      <div style={{marginTop: 20, marginBottom: 10}}>
        {this.props.user.playerId ? (
          <a
            onClick={::this._downloadExcel}
            title={this.context.t('players.downloadExcel')}
            className="pull-right clickable"
            style={{marginTop: 5}}>
            <Icon fa={this.state.isDownloading ? 'fa fa-spinner fa-pulse fa-2x' : 'fa fa-file-excel-o fa-2x'} />
          </a>
        ) : null}

        <TabbedContainer
          params={this.props.params}
          defaultTabKey={tabEventKeys.all}
          tabKeys={tabKeysConfig}
          tabRenderer={::this._renderTabContent}
          route={{base: this.context.t.route('players'), subs: 'playerTabs'}}
          forceTabs />
      </div>
    );
  }

  _getAllPlayers() {
    const players = this.props.players;
    if (this.state.filter) {
      return players.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }
    return players.sort((a, b) => a.name.localeCompare(b.name));
  }

  _renderTabGallery() {
    const players = this._getAllPlayers();
    return <PlayersCardGallery players={players} />;
  }

  _renderTabAll() {
    const players = this._getAllPlayers();
    return (
      <Table condensed hover>
        <thead>
          <tr>
            <th>{this.context.t('player.name')}</th>
            {this.props.user.playerId ? <th>{this.context.t('player.address')}</th> : null}
            <th className="hidden-xs">{this.context.t('common.competition')}</th>
            <th className="hidden-xs">{this.context.t('player.style')}</th>
          </tr>
        </thead>
        <tbody>
          {players.map(ply => {
            return (
              <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
                <td className="hidden-xs">
                  <strong>{ply.name}</strong>
                  {this.props.user.playerId ? <div><Email email={ply.contact.email} /><br />{ply.formattedMobile()}</div> : null}
                </td>
                <td className="visible-xs">
                  <strong>{this.props.user.playerId ? ply.alias : ply.name}</strong>
                  <br />
                  {this.props.user.playerId ? <div><Email email={ply.contact.email} /><br /></div> : null}
                  <Telephone number={ply.contact.mobile} hideIcon style={{fontSize: 10}} />
                </td>
                {this.props.user.playerId ? (
                  <td>
                    {ply.contact.address}
                    <br />
                    {ply.contact.city}
                  </td>
                ) : null}
                <td className="hidden-xs">
                  <PlayerCompetition comp="Vttl" player={ply} t={this.context.t} />
                  {ply.sporta && ply.vttl ? <br /> : null}
                  <PlayerCompetition comp="Sporta" player={ply} t={this.context.t} />
                </td>
                <td className="hidden-xs">
                  {ply.style.name}
                  <br />
                  <small>{ply.style.bestStroke}</small>
                </td>
              </tr>
            );}
          )}
        </tbody>
      </Table>
    );
  }
}