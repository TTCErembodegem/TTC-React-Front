import React, {Component} from 'react';
import PropTypes, {connect, withViewport, withStyles} from '../PropTypes.js';

import {TabbedContainer} from '../controls/TabbedContainer.js';
import PlayersCardGallery from './PlayersCardGallery.js';
import {PlayersToolbar} from './Players/PlayersToolbar.js';
import {PlayersVttl} from './Players/PlayersVttl.js';
import {PlayersSporta} from './Players/PlayersSporta.js';
import {PlayersAllNotLoggedIn} from './Players/PlayersAllNotLoggedIn.js';
import {PlayersAllSmall} from './Players/PlayersAllSmall.js';
import {PlayersAllBig} from './Players/PlayersAllBig.js';

@connect(state => ({
  players: state.players,
  user: state.user,
}))
@withViewport
@withStyles(require('./Players.css'))
export default class Players extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
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

  _renderTabContent(tabKey) {
    var marginLeft = 5;
    if (tabKey === 'gallery') {
      marginLeft = this.props.viewport.width > 450 ? 25 : 0;
    }


    var tabContent;
    switch (tabKey) {
    case 'all':
      tabContent = this._renderTabAll();
      break;
    case 'vttl':
      tabContent = <PlayersVttl filter={this.state.filter} />;
      break;
    case 'sporta':
      tabContent = <PlayersSporta filter={this.state.filter} />;
      break;
    case 'gallery':
      tabContent = <PlayersCardGallery players={this._getAllPlayers()} />;
      break;
    }
    return (
      <div>
        <PlayersToolbar marginLeft={marginLeft} onFilterChange={text => this.setState({filter: text})} />
        {tabContent}
      </div>
    );
  }

  render() {
    const tabKeysConfig = [{
      key: 'all',
      title: this.context.t('players.all'),
    }, {
      key: 'vttl',
      title: 'Vttl',
    }, {
      key: 'sporta',
      title: 'Sporta',
    }, {
      key: 'gallery',
      title: this.context.t('players.gallery'),
    }];

    return (
      <div style={{marginTop: 20, marginBottom: 10}}>
        <TabbedContainer
          params={this.props.params}
          defaultTabKey="all"
          tabKeys={tabKeysConfig}
          tabRenderer={::this._renderTabContent}
          route={{base: this.context.t.route('players'), subs: 'playerTabs'}}
          forceTabs />
      </div>
    );
  }

  _renderTabAll() {
    const players = this._getAllPlayers();
    if (!this.props.user.playerId) {
      return <PlayersAllNotLoggedIn players={players} t={this.context.t} />;
    }
    if (this.props.viewport.width < 700) {
      return <PlayersAllSmall players={players} t={this.context.t} />;
    }

    return <PlayersAllBig players={players} t={this.context.t} />;
  }

  _getAllPlayers() {
    const players = this.props.players;
    if (this.state.filter) {
      return players.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }
    return players.sort((a, b) => a.name.localeCompare(b.name));
  }
}
