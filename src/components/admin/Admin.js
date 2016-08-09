import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import MatchModel from '../../models/MatchModel.js';
import TeamModel from '../../models/TeamModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import TabbedContainer from '../controls/TabbedContainer.js';
import AdminPlayers from './AdminPlayers.js';
import AdminTeams from './AdminTeams.js';

const tabEventKeys = {
  players: 1,
  teams: 2,
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
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    matches: ImmutablePropTypes.listOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    teams: ImmutablePropTypes.listOf(PropTypes.instanceOf(TeamModel).isRequired).isRequired,
    players: PropTypes.object.isRequired,
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