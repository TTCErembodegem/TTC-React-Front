import React, { Component } from 'react';
import PropTypes, { connect, withViewport, keyMirror, withStyles } from '../PropTypes.js';
import cn from 'classnames';
import moment from 'moment';
import http from '../../utils/httpClient.js';

import Table from 'react-bootstrap/lib/Table';
import TextField from 'material-ui/TextField';

import TabbedContainer from '../controls/TabbedContainer.js';
import { Telephone, Icon, Email, DownloadExcelIcon } from '../controls.js';
import { PlayerAllCompetitions, PlayerFrenoyLink } from './PlayerCard.js';
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
@withStyles(require('./Players.css'))
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

  _renderToolbar(activeTab) {
    var marginLeft = 5;
    if (activeTab === tabEventKeys.gallery) {
      marginLeft = this.props.viewport.width > 450 ? 25 : 0;
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

    // Sorting as required by the Sporta scoresheet Excel
    //players = players.sort((a, b) => a.name.localeCompare(b.name));
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
          <DownloadExcelIcon
            onClick={() => http.download.playersExcel(this.context.t('players.downloadExcelFileName'))}
            title={this.context.t('players.downloadExcel')}
            className="pull-right"
            style={{marginTop: 5}}
          />
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
    const showCompetitionColumn = !this.props.user.playerId || this.props.viewport.width > 700;

    if (!this.props.user.playerId) {
      return <NotLoggedInPlayersAll players={players} t={this.context.t} />;
    }
    if (this.props.viewport.width < 700) {
      return <SmallPlayersAll players={players} t={this.context.t} />;
    }

    return (
      <Table condensed hover className="players">
        <thead>
          <tr>
            <th>{this.context.t('player.name')}</th>
            <th>{this.context.t('player.address')}</th>
            <th>{this.context.t('common.competition')}</th>
            <th className="hidden-sm hidden-xs">{this.context.t('player.style')}</th>
          </tr>
        </thead>
        <tbody>
          {players.map(ply => {
            return (
              <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
                <td>
                  <strong>{ply.name}</strong>
                  <br />
                  <Email email={ply.contact.email} />
                  <br />
                  <Telephone number={ply.contact.mobile} hideIcon />
                </td>
                <td>
                  {ply.contact.address}
                  <br />
                  {ply.contact.city}
                </td>
                <td>
                  <PlayerAllCompetitions player={ply} t={this.context.t} />
                </td>
                <td className="hidden-sm hidden-xs">
                  {ply.style.name}
                  <br />
                  <small>{ply.style.bestStroke}</small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

const NotLoggedInPlayersAll = ({players, t}) => {
  return (
    <Table condensed hover className="players">
      <thead>
        <tr>
          <th>{t('player.name')}</th>
          <th>{t('common.competition')}</th>
          <th className="hidden-sm hidden-xs">{t('player.style')}</th>
        </tr>
      </thead>
      <tbody>
        {players.map(ply => {
          return (
            <tr key={ply.id}>
              <td>
                <strong>{ply.name}</strong>
              </td>
              <td>
                <PlayerAllCompetitions player={ply} t={t} />
              </td>
              <td className="hidden-sm hidden-xs">
                {ply.style.name}
                <br />
                <small>{ply.style.bestStroke}</small>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

const SmallPlayersAll = ({players, t}) => {
  return (
    <Table condensed hover className="players row-by-two">
      <thead>
        <tr>
          <th>{t('player.name')}</th>
          <th>{t('player.address')}</th>
        </tr>
      </thead>
      <tbody>
        {players.map(ply => {
          return [
            <tr key={ply.id + '_name'} className={cn({'match-won': ply.isMe()})}>
              <td colSpan={2}>
                <strong>{ply.name}</strong>
              </td>
            </tr>,
            <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
              <td className="truncate">
                <Email email={ply.contact.email} />
                <br />
                <Telephone number={ply.contact.mobile} hideIcon />
              </td>
              <td>
                {ply.contact.address}
                <br />
                {ply.contact.city}
              </td>
            </tr>
          ];
        })}
      </tbody>
    </Table>
  );
};
