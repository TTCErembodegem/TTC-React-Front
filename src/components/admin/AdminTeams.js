import React, {Component} from 'react';
import PropTypes, {connect, withViewport} from '../PropTypes.js';
import Immutable from 'immutable';
import {toggleTeamPlayer} from '../../actions/playerActions.js';
import {frenoyTeamSync} from '../../actions/matchActions.js';
import _ from 'lodash';

import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Button from 'react-bootstrap/lib/Button';

import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import PlayersImageGallery from '../players/PlayersImageGallery.js';

import {teamPlayerType} from '../../models/TeamModel.js';

@connect(state => {
  return {user: state.user};
}, {toggleTeamPlayer, frenoyTeamSync})
@withViewport
export default class AdminTeams extends React.Component {
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
            onFrenoySync={this.props.frenoyTeamSync} />
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

  _onRoleChange(event, index, value) {
    this.setState({role: value});
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
    const team = this.props.team;
    return (
      <div style={{paddingLeft: 10, paddingRight: 10}}>
        <Paper style={{padding: 20, marginBottom: 20}}>
          <h4>
            {team.renderOwnTeamTitle()}
            <Button style={{marginLeft: 20}} onClick={() => this.props.onFrenoySync(team.id)}>Frenoy Sync</Button>
          </h4>

          <PlayersImageGallery
            players={Immutable.List(team.getPlayers().map(ply => ply.player))}
            user={this.props.user}
            competition={team.competition}
            viewport={this.props.viewport}
            subtitle={this._renderPlayerSubtitle.bind(this, team)} />

          <br />

          <SelectField value={this.state.role} onChange={::this._onRoleChange} style={{width: 100, marginRight: 10}}>
            {_.toArray(teamPlayerType).map(role => <MenuItem key={role} value={role} primaryText={role} />)}
          </SelectField>

          <div style={{width: 200}}>
            <PlayerAutoComplete
              clearOnSelect
              selectPlayer={::this._onToggleTeamPlayer}
              fullWidth
              hintText="Selecteer speler"
              competition={team.competition} />
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
