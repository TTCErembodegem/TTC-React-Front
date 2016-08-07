import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { toggleTeamPlayer } from '../../actions/playerActions.js';
import moment from 'moment';
import withViewport from '../../utils/decorators/withViewport.js';

import Table from 'react-bootstrap/lib/Table';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import Panel from 'react-bootstrap/lib/Panel';
import Paper from 'material-ui/lib/paper';

import Icon from '../controls/Icon.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import PlayersImageGallery from '../players/PlayersImageGallery.js';

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

  _toggleTeamPlayer(teamId, playerId) {
    this.props.toggleTeamPlayer(teamId, playerId);
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


  render() {
    console.log(this.props.team.getPlayers());
    return (
      <div>
        <Paper style={{padding: 20, marginBottom: 20}}>
          <h4>{this.props.team.renderOwnTeamTitle()}</h4>

          <PlayersImageGallery
            players={this.props.team.getPlayers().map(ply => ply.player)}
            user={this.props.user}
            competition={this.props.team.competition}
            viewport={this.props.viewport} />

          <br />

          <PlayerAutoComplete
            selectPlayer={this.props.toggleTeamPlayer}
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