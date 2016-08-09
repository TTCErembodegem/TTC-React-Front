import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { updatePlayer } from '../../actions/playerActions.js';
import moment from 'moment';

import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import TextField from 'material-ui/lib/text-field';

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
    this.state = {filter: 'active', playerFilter: ''};
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
      players = this.props.recreantAndQuitters;
      if (this.state.filter) {
        players = players.filter(x => x.name.toLowerCase().includes(this.state.playerFilter));
      }
      players = <InactivesTable players={players} updatePlayer={this.props.updatePlayer} />;
      break;

    case 'active':
    default:
      players = this.props.players;
      if (this.state.filter) {
        players = players.filter(x => x.name.toLowerCase().includes(this.state.playerFilter));
      }
      players = (
        <ActivesTable
          players={players}
          onEditPlayer={ply => this.setState({filter: 'edit-player', selectedPlayer: ply})}
          updatePlayer={this.props.updatePlayer} />
      );
      break;
    }
    return (
      <div>
        <AdminPlayersToolbar onFilterChange={newFilter => this.setState({filter: newFilter})} />
        <br />
        <TextField
          hintText="Zoek speler"
          onChange={e => this.setState({playerFilter: e.target.value.toLowerCase()})}
          style={{width: 150, marginLeft: 10}} />
        {players}
      </div>
    );
  }
}

const AdminPlayersToolbar = ({onFilterChange}) => (
  <div style={{display: 'inline'}}>
    <Button style={{margin: 5}} bsStyle="info" onClick={() => onFilterChange('inactive')}>Recreant activeren</Button>
    <Button style={{margin: 5}} bsStyle="info" onClick={() => onFilterChange('active')}>Spelers beheren</Button>
    <Button style={{margin: 5}} bsStyle="info" onClick={() => onFilterChange('new-player')}>Nieuw lid</Button>
    <Button bsStyle="info" onClick={() => onFilterChange('set-password')}>Paswoord reset</Button>
  </div>
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
        <th className="hidden-xs">Competities</th>
        <th className="hidden-xs">Toegang</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {players.sort((a, b) => a.name.localeCompare(b.name)).map(ply => (
        <tr key={ply.id}>
          <td>
            <strong>{ply.name}</strong> <small className="hidden-xs">({ply.alias})</small>
            <br />
            <small>
              <a href={'mailto:' + ply.contact.email}>{ply.contact.email}</a>
              <span style={{marginLeft: 20, marginRight: 20}} className="hidden-sm hidden-xs">{ply.contact.address + ', ' + ply.contact.city}</span>
              <br className="visible-sm visible-xs" />
              <span>{ply.formattedMobile()}</span>
            </small>
          </td>
          <td className="hidden-xs">{concatCompetitions(ply.vttl, ply.sporta)}</td>
          <td className="hidden-xs">{ply.security === 'Player' ? '' : ply.security}</td>
          <td>
            <Icon fa="fa fa-pencil-square-o clickable" onClick={() => onEditPlayer(ply)} style={{fontSize: 26}} />
            {!ply.vttl && !ply.sporta ? (
              <button className="btn btn-default" style={{marginLeft: 10}} onClick={() => {
                ply.active = false;
                ply.quitYear = moment().year();
                ply.security = 'Player';
                updatePlayer(ply, {activeChanged: true});
              }}>
                <span className="hidden-xs">Recreant deactiveren</span>
                <span className="visible-xs">X</span>
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
        <th className="hidden-xs">Alias</th>
        <th className="hidden-xs">Gestopt</th>
        <th>Acties</th>
      </tr>
    </thead>
    <tbody>
      {players.sort((a, b) => b.quitYear - a.quitYear).map(ply => (
        <tr key={ply.id}>
          <td>{ply.name}</td>
          <td className="hidden-xs">{ply.alias}</td>
          <td className="hidden-xs">{ply.quitYear}</td>
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