import React, {Component} from 'react';
import Immutable from 'immutable';
import _ from 'lodash';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from 'react-bootstrap/lib/Button';
import MenuItem from '@material-ui/core/MenuItem';
import {frenoyTeamSync} from '../../actions/matchActions';
import {toggleTeamPlayer} from '../../actions/playerActions';
import PropTypes, {connect, withViewport} from '../PropTypes';

import PlayerAutoComplete from '../players/PlayerAutoComplete';
import PlayersImageGallery from '../players/PlayersImageGallery';
import {teamPlayerType} from '../../models/model-interfaces';

class AdminTeams extends React.Component {
  static propTypes = {
    teams: PropTypes.TeamModelList,
    toggleTeamPlayer: PropTypes.func.isRequired,
    frenoyTeamSync: PropTypes.func.isRequired,
    viewport: PropTypes.viewport,
    user: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {filter: 'Vttl'};
  }

  _toggleTeamPlayer(teamId, playerId, role) {
    this.props.toggleTeamPlayer(teamId, playerId, role);
  }

  render() {
    return (
      <div>
        <AdminTeamsToolbar onFilterChange={newFilter => this.setState({filter: newFilter})} />
        {this.props.teams.filter(team => team.competition === this.state.filter).sort((a, b) => a.teamCode - b.teamCode).map(team => (
          <AdminTeamPlayers
            key={team.id}
            team={team}
            toggleTeamPlayer={this._toggleTeamPlayer.bind(this, team.id)}
            viewport={this.props.viewport}
            user={this.props.user}
            onFrenoySync={this.props.frenoyTeamSync}
          />
        ))}
      </div>
    );
  }
}

class AdminTeamPlayers extends Component {
  static propTypes = {
    team: PropTypes.object.isRequired,
    toggleTeamPlayer: PropTypes.func.isRequired,
    viewport: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onFrenoySync: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {role: 'Standard'};
  }

  _onRoleChange(event) {
    this.setState({role: event.target.value});
  }

  _onToggleTeamPlayer(playerId) {
    this.props.toggleTeamPlayer(playerId, this.state.role);
    this.setState({role: 'Standard'});
  }

  _renderPlayerSubtitle(team, ply) {
    const player = team.getPlayers().find(p => p.player.id === ply.id);
    return <span>{player ? player.type : null}</span>;
  }

  render() {
    const {team} = this.props;
    return (
      <div style={{paddingLeft: 10, paddingRight: 10}}>
        <Paper style={{padding: 20, marginBottom: 20}}>
          <h4>
            {team.renderOwnTeamTitle()}
            <Button style={{marginLeft: 20}} onClick={() => this.props.onFrenoySync(team.id)}>Frenoy Sync</Button>
          </h4>

          <PlayersImageGallery
            players={Immutable.List(team.getPlayers().map(ply => ply.player))}
            competition={team.competition}
            subtitle={this._renderPlayerSubtitle.bind(this, team)}
            forceSmall
          />

          <div style={{clear: 'both'}} />

          <TextField select value={this.state.role} onChange={e => this._onRoleChange(e)} style={{width: 100, marginRight: 10}}>
            {_.toArray(teamPlayerType).map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
          </TextField>

          <div style={{width: 250}}>
            <PlayerAutoComplete
              clearOnSelect
              selectPlayer={playerId => this._onToggleTeamPlayer(playerId)}
              fullWidth
              placeholder="Selecteer speler"
              competition={team.competition}
            />
          </div>
        </Paper>
      </div>
    );
  }
}

const AdminTeamsToolbar = ({onFilterChange}) => (
  <div style={{padding: 10}}>
    <Button bsStyle="info" style={{marginRight: 10}} onClick={() => onFilterChange('Vttl')}>Vttl</Button>
    <Button bsStyle="info" onClick={() => onFilterChange('Sporta')}>Sporta</Button>
  </div>
);

AdminTeamsToolbar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default withViewport(connect(state => ({user: state.user}), {toggleTeamPlayer, frenoyTeamSync})(AdminTeams));
