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

import './Players.css';

class Players extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
    viewport: PropTypes.viewport,

    match: PropTypes.shape({
      params: PropTypes.shape({
        tabKey: PropTypes.string
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      sort: 'Vttl',
      sortDir: 'asc',
    };
  }

  _renderTabContent(tabKey) {
    var tabContent;
    switch (tabKey) {
    case 'list':
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
        <PlayersToolbar
          marginLeft={15}
          onFilterChange={text => this.setState({filter: text})}

          canSort={tabKey !== 'vttl' && tabKey !== 'sporta'}
          onSortChange={key => this.setState({sort: key})}
          onSortDirectionChange={key => this.setState({sortDir: key})}
          activeSort={this.state.sort}
          activeSortDirection={this.state.sortDir}
        />
        {tabContent}
      </div>
    );
  }

  render() {
    const tabKeysConfig = [{
      key: 'gallery',
      title: this.context.t('players.gallery'),
    }, {
      key: 'vttl',
      title: 'Vttl',
    }, {
      key: 'sporta',
      title: 'Sporta',
    }, {
      key: 'list',
      title: this.context.t('players.list'),
    }];

    return (
      <div style={{marginTop: 20, marginBottom: 10}}>
        <TabbedContainer
          match={this.props.match}
          defaultTabKey={this.props.viewport.width < 450 ? 'list' : 'gallery'}
          tabKeys={tabKeysConfig}
          tabRenderer={::this._renderTabContent}
          route={{base: this.context.t.route('players'), subs: 'playersTabs'}}
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
    let players = this.props.players;
    if (this.state.filter) {
      players = players.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }

    var filter;
    switch (this.state.sort) {
    case 'Vttl':
    case 'Sporta':
      filter = (plyA, plyB) => {
        const compA = plyA.getCompetition(this.state.sort);
        const compB = plyB.getCompetition(this.state.sort);
        if (!compA.ranking && !compB.ranking) {
          return 0;
        }
        if (!compA.ranking) {
          return 1;
        }
        if (!compB.ranking) {
          return -1;
        }
        return compA.position - compB.position;
      };
      break;
    default:
      filter = (plyA, plyB) => plyA.name.localeCompare(plyB.name);
    }

    players = players.sort(filter);
    if (this.state.sortDir === 'desc') {
      players = players.reverse();
    }

    return players;
  }
}

export default withViewport(connect(state => ({
  players: state.players,
  user: state.user,
}))(Players));
