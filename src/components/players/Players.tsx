import React, {Component} from 'react';
import PropTypes, {connect, withViewport} from '../PropTypes';

import {TabbedContainer} from '../controls/TabbedContainer';
import PlayersCardGallery from './PlayersCardGallery';
import {PlayersToolbar} from './Players/PlayersToolbar';
import {PlayersVttl} from './Players/PlayersVttl';
import {PlayersSporta} from './Players/PlayersSporta';
import {PlayersAllNotLoggedIn} from './Players/PlayersAllNotLoggedIn';
import {PlayersAllSmall} from './Players/PlayersAllSmall';
import {PlayersAllBig} from './Players/PlayersAllBig';
import {Viewport, TabbedContainerEventKeyRouteProps, IPlayer, Competition} from '../../models/model-interfaces';
import {IUser} from '../../models/UserModel';

import './Players.css';

type PlayersProps = {
  players: IPlayer[];
  user: IUser;
  viewport: Viewport;
  match: TabbedContainerEventKeyRouteProps;
}

type PlayersState = {
  filter: string;
  sort: Competition;
  sortDir: 'asc' | 'desc';
}

class Players extends Component<PlayersProps, PlayersState> {
  static contextTypes = PropTypes.contextTypes;

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      sort: 'Vttl',
      sortDir: 'asc',
    };
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
    let {players} = this.props;
    if (this.state.filter) {
      players = players.filter(x => x.name.toLowerCase().includes(this.state.filter));
    }

    let filter;
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

  _renderTabContent(tabKey) {
    let tabContent;
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
      default:
        tabContent = '';
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
          tabRenderer={eventKey => this._renderTabContent(eventKey)}
          route={{base: this.context.t.route('players'), subs: 'playersTabs'}}
          forceTabs
        />
      </div>
    );
  }
}

export default withViewport(connect(state => ({
  players: state.players,
  user: state.user,
}))(Players));
