import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import MatchModel from '../../models/MatchModel.js';
import TeamModel from '../../models/TeamModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import AdminPlayers from './AdminPlayers.js';
import AdminTeams from './AdminTeams.js';

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
  constructor() {
    super();
    this.state = {section: 'players'};
  }

  _renderSection() {
    switch (this.state.section) {
    case 'teams':
      return <AdminTeams teams={this.props.teams} />;
    case 'players':
      return <AdminPlayers players={this.props.players} recreantAndQuitters={this.props.admin.players} />;
    }
  }

  render() {
    if (!this.props.user.isAdmin()) {
      return null;
    }

    return (
      <div style={{marginTop: 20, marginBottom: 20}}>
        <AdminMenu onSectionChange={section => this.setState({section})} />
        <div style={{marginLeft: 160, marginTop: -8}}>
          {this._renderSection()}
        </div>
      </div>
    );
  }
}

class AdminMenu extends React.Component {
  static propTypes = {
    onSectionChange: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div style={{width: 150, border: 'solid 1px #d9d9d9', position: 'absolute', top: 75, left: 15}}>
        <List>
          <ListItem primaryText="Spelers" onTouchTap={() => this.props.onSectionChange('players')} />
          <ListItem primaryText="Ploegen" onTouchTap={() => this.props.onSectionChange('teams')} />
        </List>
      </div>
    );
  }
}