import React, {Component} from 'react';
import PropTypes, {connect, keyMirror} from '../PropTypes';

import {TabbedContainer} from '../controls/TabbedContainer';
import AdminPlayers from './AdminPlayers';
import AdminTeams from './AdminTeams';
import AdminClubs from './AdminClubs';
import AdminDev from './AdminDev';
import AdminPlayerLineup from './AdminPlayerLineup';
import ProfilePhotoForm, {ProfilePhotoAvatarForm} from '../users/ProfilePhotoForm';
import {AdminEmail} from './AdminEmail';
import {AdminMatches} from './AdminMatches';
import {AdminParams} from './AdminParams';
import {IUser} from '../../models/UserModel';
import {IMatch, ITeam, IClub, IPlayer, TabbedContainerEventKeyRouteProps} from '../../models/model-interfaces';

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

type AdminProps = {
  config: any;
  user: IUser;
  matches: IMatch[];
  teams: ITeam[];
  clubs: IClub[];
  players: IPlayer[];
  admin: {
    /** Retired players */
    players: IPlayer[];
  },
  match: TabbedContainerEventKeyRouteProps,
}


class Admin extends Component<AdminProps> {
  static contextTypes = PropTypes.contextTypes;

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
            <ProfilePhotoForm admin />
            <hr style={{marginTop: 50}} />
            <h1 style={{marginLeft: 25}}>Avatar</h1>
            <ProfilePhotoAvatarForm admin />
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
      default:
        return null;
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

export default connect(state => ({
  config: state.config,
  user: state.user,
  players: state.players,
  clubs: state.clubs,
  matches: state.matches,
  teams: state.teams,
  admin: state.admin,
}))(Admin);
