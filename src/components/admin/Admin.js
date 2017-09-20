import React, {Component} from 'react';
import PropTypes, {connect, keyMirror} from '../PropTypes.js';

import {TabbedContainer} from '../controls/TabbedContainer.js';
import AdminPlayers from './AdminPlayers.js';
import AdminTeams from './AdminTeams.js';
import AdminDev from './AdminDev.js';
import AdminPlayerLineup from './AdminPlayerLineup.js';
import ProfilePhotoForm from '../users/ProfilePhotoForm.js';

const tabEventKeys = keyMirror({
  players: '',
  teams: '',
  formation: '',
  pictures: '',
  dev: '',
});

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
    admin: state.admin,
  };
})
export default class Admin extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    players: PropTypes.PlayerModelList.isRequired,
    admin: PropTypes.shape({
      players: PropTypes.object.isRequired, // = gestopte spelers
    }).isRequired,
    params: PropTypes.shape({
      tabKey: PropTypes.string
    }),
  }

  _renderSection(eventKey) {
    switch (eventKey) {
    case tabEventKeys.teams:
      return <AdminTeams teams={this.props.teams} />;
    case tabEventKeys.players:
      return <AdminPlayers players={this.props.players} recreantAndQuitters={this.props.admin.players} />;
    case tabEventKeys.formation:
      return <AdminPlayerLineup />;
    case tabEventKeys.pictures:
      return <ProfilePhotoForm admin={true} />;
    case tabEventKeys.dev:
      return <AdminDev />;
    }
  }

  render() {
    if (!this.props.user.isAdmin()) {
      return null;
    }

    const tabConfig = [{
      key: tabEventKeys.players,
      title: 'Spelers',
    }, {
      key: tabEventKeys.teams,
      title: 'Teams',
    }, {
      key: tabEventKeys.formation,
      title: 'Opstellingen',
    }, {
      key: tabEventKeys.pictures,
      title: 'Foto\'s',
    }, {
      key: tabEventKeys.dev,
      title: 'Dev',
    }];

    return (
      <TabbedContainer
        params={this.props.params}
        style={{marginTop: 10, marginBottom: 20}}
        defaultTabKey={tabEventKeys.players}
        route={{base: this.context.t.route('admin')}}
        tabKeys={tabConfig}
        tabRenderer={::this._renderSection} />
    );
  }
}