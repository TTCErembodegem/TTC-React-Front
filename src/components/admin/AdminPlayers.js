import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { updatePlayer } from '../../actions/playerActions.js';
import moment from 'moment';

import Table from 'react-bootstrap/lib/Table';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';

import Icon from '../controls/Icon.js';
import AdminPlayerForm from './AdminPlayerForm.js';
import { ChangeAnyPassword } from '../users/ChangePassword.js';

@connect(() => ({}), {updatePlayer})
export default class AdminPlayers extends Component {
  static propTypes = {
    players: PropTypes.object,
    recreantAndQuitters: PropTypes.object,
    updatePlayer: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {filter: 'active'};
  }

  _setDefaultForm() {
    this.setState({filter: null});
  }

  render() {
    let players;
    switch (this.state.filter) {
    case 'new-player':
      return <AdminPlayerForm onEnd={::this._setDefaultForm} />;

    case 'edit-player':
      return <AdminPlayerForm player={this.state.selectedPlayer} onEnd={::this._setDefaultForm} />;

    case 'set-password':
      return <ChangeAnyPassword onEnd={::this._setDefaultForm} />;

    case 'inactive':
      players = <InactivesTable players={this.props.recreantAndQuitters} updatePlayer={this.props.updatePlayer} />;
      break;

    case 'active':
    default:
      players = (
        <ActivesTable
          players={this.props.players}
          onEditPlayer={ply => this.setState({filter: 'edit-player', selectedPlayer: ply})}
          updatePlayer={this.props.updatePlayer} />
      );
      break;
    }
    return (
      <div>
        <AdminPlayersToolbar onFilterChange={newFilter => this.setState({filter: newFilter})} />
        {players}
      </div>
    );
  }
}

const AdminPlayersToolbar = ({onFilterChange}) => (
  <Toolbar>
    <ToolbarGroup firstChild={true} float="left">
      <RaisedButton label="Recreant activeren" onTouchTap={() => onFilterChange('inactive')} />
      <RaisedButton label="Spelers beheren" onTouchTap={() => onFilterChange('active')} />
      <RaisedButton label="Nieuw lid" onTouchTap={() => onFilterChange('new-player')} />
      <RaisedButton label="Paswoord reset" onTouchTap={() => onFilterChange('set-password')} />
    </ToolbarGroup>
  </Toolbar>
);

function concatCompetitions(vttl, sporta) {
  var comps = [];
  if (vttl) {
    comps.push('Vttl');
  }
  if (sporta) {
    comps.push('Sporta');
  }
  return comps.join(', ');
}

const ActivesTable = ({players, onEditPlayer, updatePlayer}) => (
  <Table condensed hover>
    <thead>
      <tr>
        <th>Speler</th>
        <th>Competities</th>
        <th>Toegang</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {players.sort((a, b) => a.name.localeCompare(b.name)).map(ply => (
        <tr key={ply.id}>
          <td>
            <strong>{ply.name}</strong> <small>({ply.alias})</small>
            <br />
            <small>
              <a href={'mailto:' + ply.contact.email}>{ply.contact.email}</a>
              <span style={{marginLeft: 20}}>{ply.contact.address + ', ' + ply.contact.city}</span>
              <span style={{marginLeft: 20}}>{ply.formattedMobile()}</span>
            </small>
          </td>
          <td>{concatCompetitions(ply.vttl, ply.sporta)}</td>
          <td>{ply.security === 'Player' ? '' : ply.security}</td>
          <td>
            <Icon fa="fa fa-pencil-square-o clickable" onClick={() => onEditPlayer(ply)} style={{fontSize: 26}} />
            {!ply.vttl && !ply.sporta ? (
              <button className="btn btn-default" style={{marginLeft: 10}} onClick={() => {
                ply.active = false;
                ply.quitYear = moment().year();
                ply.security = 'Player';
                updatePlayer(ply, {activeChanged: true});
              }}>
                Recreant deactiveren
              </button>
            ) : null}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);


const InactivesTable = ({players, updatePlayer}) => (
  <Table condensed hover>
    <thead>
      <tr>
        <th>Speler</th>
        <th>Alias</th>
        <th>Gestopt</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {players.sort((a, b) => b.quitYear - a.quitYear).map(ply => (
        <tr key={ply.id}>
          <td>{ply.name}</td>
          <td>{ply.alias}</td>
          <td>{ply.quitYear}</td>
          <td>
            <button
              className="btn btn-default"
              onClick={() => {
                ply.active = true;
                ply.quitYear = null;
                ply.security = 'Player';
                updatePlayer(ply, {activeChanged: true});
              }}
            >
              Recreant activeren
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);