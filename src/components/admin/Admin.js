import React, {Component} from 'react';
import PropTypes, {connect, keyMirror} from '../PropTypes.js';

import {TabbedContainer} from '../controls/TabbedContainer.js';
import AdminPlayers from './AdminPlayers.js';
import AdminTeams from './AdminTeams.js';
import AdminClubs from './AdminClubs.js';
import AdminDev from './AdminDev.js';
import AdminPlayerLineup from './AdminPlayerLineup.js';
import ProfilePhotoForm, {ProfilePhotoAvatarForm} from '../users/ProfilePhotoForm.js';
import {AdminEmail} from './AdminEmail.js';
import {AdminMatches} from './AdminMatches.js';
import {AdminParams} from './AdminParams.js';

const tabEventKeys = keyMirror({
  players: '',
  teams: '',
  clubs: '',
  formation: '',
  pictures: '',
  emails: '',
  matches: '',
  configParams: '',
  dev: '',
});


class Admin extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    clubs: PropTypes.ClubModelList.isRequired,
    players: PropTypes.PlayerModelList.isRequired,
    admin: PropTypes.shape({
      players: PropTypes.object.isRequired, // = gestopte spelers
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        tabKey: PropTypes.string
      }),
    }),
  }

  _renderSection(eventKey) {
    switch (eventKey) {
    case tabEventKeys.teams:
      return <AdminTeams teams={this.props.teams} />;
    case tabEventKeys.players:
      return <AdminPlayers players={this.props.players} recreantAndQuitters={this.props.admin.players} />;
    case tabEventKeys.clubs:
      return <AdminClubs clubs={this.props.clubs} />;
    case tabEventKeys.formation:
      return <AdminPlayerLineup />;
    case tabEventKeys.pictures:
      return (
        <div>
          <h1 style={{marginLeft: 25}}>Foto</h1>
          <ProfilePhotoForm admin={true} />
          <hr style={{marginTop: 50}} />
          <h1 style={{marginLeft: 25}}>Avatar</h1>
          <ProfilePhotoAvatarForm admin={true} />
        </div>
      );
    case tabEventKeys.emails:
      return <AdminEmail />;
    case tabEventKeys.dev:
      return <AdminDev />;
    case tabEventKeys.matches:
      return <AdminMatches />;
    case tabEventKeys.configParams:
      return <AdminParams />;
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
      key: tabEventKeys.clubs,
      title: 'Clubs',
    }, {
      key: tabEventKeys.formation,
      title: 'Opstellingen',
    }, {
      key: tabEventKeys.matches,
      title: 'Matchen',
    }, {
      key: tabEventKeys.pictures,
      title: 'Foto\'s',
    }, {
      key: tabEventKeys.emails,
      title: 'Email',
    }, {
      key: tabEventKeys.configParams,
      title: 'Params',
    }, {
      key: tabEventKeys.dev,
      title: 'Dev',
    }];

    return (
      <TabbedContainer
        match={this.props.match}
        style={{marginTop: 10, marginBottom: 20}}
        defaultTabKey={tabEventKeys.players}
        route={{base: this.context.t.route('admin')}}
        tabKeys={tabConfig}
        tabRenderer={eventKey => this._renderSection(eventKey)}
      />
    );
  }
}

export default connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
    admin: state.admin,
  };
})(Admin)
