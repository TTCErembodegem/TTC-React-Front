import React, { Component } from 'react';
import PropTypes, { connect } from '../PropTypes.js';

import TabbedContainer from '../controls/TabbedContainer.js';
import AdminPlayers from './AdminPlayers.js';
import AdminTeams from './AdminTeams.js';
import AdminMatches from './AdminMatches.js';

const tabEventKeys = {
  players: 1,
  teams: 2,
  matches: 3
};

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
      players: PropTypes.object.isRequired,
    }).isRequired,
  }

  _renderSection(eventKey) {
    switch (eventKey) {
    case tabEventKeys.teams:
      return <AdminTeams teams={this.props.teams} />;
    case tabEventKeys.players:
      return <AdminPlayers players={this.props.players} recreantAndQuitters={this.props.admin.players} />;
    case tabEventKeys.matches:
      return <AdminMatches />;
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
      key: tabEventKeys.matches,
      title: 'Matchen',
    }];

    return (
      <TabbedContainer
        style={{marginTop: 10, marginBottom: 20}}
        openTabKey={tabEventKeys.players}
        tabKeys={tabConfig}
        tabRenderer={::this._renderSection} />
    );
  }
}