import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { toggleTeamPlayer } from '../../actions/playerActions.js';
import _ from 'lodash';
import withViewport from '../../utils/decorators/withViewport.js';

import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import Paper from 'material-ui/lib/paper';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import PlayersImageGallery from '../players/PlayersImageGallery.js';

import { teamPlayerType } from '../../models/TeamModel.js';

@connect(state => {
  return {user: state.user};
}, {toggleTeamPlayer})
@withViewport
export default class AdminTeams extends React.Component {
  static propTypes = {
    teams: PropTypes.object,
    toggleTeamPlayer: PropTypes.func.isRequired,
    viewport: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }
  constructor() {
    super();
    this.state = {filter: 'Vttl'};
  }

  _setDefaultForm() {
    this.setState({filter: 'Vttl'});
  }

  _toggleTeamPlayer(teamId, playerId, role) {
    this.props.toggleTeamPlayer(teamId, playerId, role);
  }

  render() {
    //console.log(this.props.teams.first());
    switch (this.state.filter) {
    case 'Vttl':
    case 'Sporta':
    default:
      return (
        <div>
          <AdminTeamsToolbar onFilterChange={newFilter => this.setState({filter: newFilter})} />
          {this.props.teams.filter(team => team.competition === this.state.filter).sort((a, b) => a.teamCode - b.teamCode).map(team => (
            <AdminTeamPlayers
              key={team.id}
              team={team}
              toggleTeamPlayer={this._toggleTeamPlayer.bind(this, team.id)}
              viewport={this.props.viewport}
              user={this.props.user} />
          ))}
        </div>
      );
    }
  }
}

class AdminTeamPlayers extends Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    toggleTeamPlayer: PropTypes.func.isRequired,
    viewport: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }
  constructor() {
    super();
    this.state = {role: 'Standard'};
  }

  _onRoleChange(event, index, value) {
    this.setState({role: value});
  }
  _onToggleTeamPlayer(playerId) {
    this.props.toggleTeamPlayer(playerId, this.state.role);
  }

  render() {
    const team = this.props.team;
    return (
      <div>
        <Paper style={{padding: 20, marginBottom: 20}}>
          <h4>{team.renderOwnTeamTitle()}</h4>

          <PlayersImageGallery
            players={team.getPlayers().map(ply => ply.player)}
            user={this.props.user}
            competition={team.competition}
            viewport={this.props.viewport} />

          <br />

          <SelectField value={this.state.role} onChange={::this._onRoleChange}>
            {_.toArray(teamPlayerType).map(role => <MenuItem key={role} value={role} primaryText={role} />)}
          </SelectField>

          <PlayerAutoComplete
            selectPlayer={::this._onToggleTeamPlayer}
            style={{marginLeft: 10}}
            hintText="Selecteer speler" />
        </Paper>
      </div>
    );
  }
}

const AdminTeamsToolbar = ({onFilterChange}) => (
  <Toolbar style={{marginBottom: 10}}>
    <ToolbarGroup firstChild={true} float="left">
      <RaisedButton label="Teams Vttl" onTouchTap={() => onFilterChange('Vttl')} />
      <RaisedButton label="Teams Sporta" onTouchTap={() => onFilterChange('Sporta')} />
    </ToolbarGroup>
  </Toolbar>
);