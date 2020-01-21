/* eslint-disable no-nested-ternary */
import React, {Component} from 'react';
import moment from 'moment';
import Table from 'react-bootstrap/lib/Table';
import TextField from '@material-ui/core/TextField';
import {updatePlayer, frenoySync, deletePlayer} from '../../actions/playerActions';
import {connect, withViewport} from '../PropTypes';
import AdminPlayerForm from './AdminPlayerForm';
import AdminChangePassword from './AdminChangePassword';
import AdminBoardMembers from './AdminBoardMembers';
import {ButtonStack} from '../controls/Buttons/ButtonStack';
import {EditButton} from '../controls/Buttons/EditButton';
import {Icon} from '../controls/Icons/Icon';
import {IPlayer, Viewport, Competition} from '../../models/model-interfaces';

const keepTrackOfPlayerKeys = false;

type AdminPlayersProps = {
  players: IPlayer[];
  recreantAndQuitters: any;
  updatePlayer: Function;
  deletePlayer: Function;
  viewport: Viewport;
  frenoySync: Function;
}

type AdminPlayersState = {
  filter: 'active' | 'new-player' | 'Speler editeren' | 'set-password' | 'inactive' | 'bestuur';
  playerFilter: string;
  selectedPlayer: IPlayer;
}

class AdminPlayers extends Component<AdminPlayersProps, AdminPlayersState> {
  constructor(props) {
    super(props);
    this.state = {filter: 'active', playerFilter: ''};
  }

  _setDefaultForm() {
    this.setState({filter: 'active'});
  }

  render() {
    let players;
    let playersContent;
    let otherContent = null;
    switch (this.state.filter) {
      case 'new-player':
        otherContent = <AdminPlayerForm onEnd={() => this._setDefaultForm()} />;
        break;

      case 'Speler editeren':
        otherContent = <AdminPlayerForm player={this.state.selectedPlayer} onEnd={() => this._setDefaultForm()} />;
        break;

      case 'set-password':
        otherContent = <AdminChangePassword onEnd={() => this._setDefaultForm()} />;
        break;

      case 'bestuur':
        otherContent = <AdminBoardMembers onEnd={() => this._setDefaultForm()} />;
        break;

      case 'inactive':
        players = this.props.recreantAndQuitters;
        if (this.state.filter) {
          players = players.filter(x => x.name.toLowerCase().includes(this.state.playerFilter));
        }
        playersContent = <InactivesTable players={players} onUpdatePlayer={this.props.updatePlayer} onDeletePlayer={this.props.deletePlayer} />;
        break;

      case 'active':
      default:
        players = this.props.players;
        if (this.state.playerFilter) {
          players = players.filter(x => x.name.toLowerCase().includes(this.state.playerFilter));
        }
        playersContent = (
          <ActivesTable
            players={players}
            onEditPlayer={ply => this.setState({filter: 'Speler editeren', selectedPlayer: ply})}
            onUpdatePlayer={this.props.updatePlayer}
          />
        );
        break;
    }

    const viewsConfig = [{
      key: 'active',
      text: 'Spelers beheren',
    }, {
      key: 'inactive',
      text: 'Activeren / Verwijderen',
    }, {
      key: 'new-player',
      text: 'Nieuw lid',
    }, {
      key: 'set-password',
      text: 'Paswoord reset',
    }, {
      key: 'bestuur',
      text: 'Bestuur',
    }];
    return (
      <div>
        <div style={{marginTop: 5, marginLeft: 5}}>
          <ButtonStack
            config={viewsConfig}
            small={this.props.viewport.width < 550}
            activeView={this.state.filter}
            onClick={newFilter => this.setState({filter: newFilter})}
          />
        </div>
        <br />

        {playersContent ? (
          <div>
            <TextField
              placeholder="Zoek speler"
              onChange={e => this.setState({playerFilter: e.target.value.toLowerCase()})}
              style={{width: 150, marginLeft: 10}}
            />

            <button
              type="button"
              className="btn btn-default pull-right"
              style={{marginRight: 15}}
              onClick={() => this.props.frenoySync()}
            >
              Frenoy Sync
            </button>

            {playersContent}
          </div>
        ) : otherContent}
      </div>
    );
  }
}

function concatCompetitions(vttl: boolean, sporta: boolean): string {
  const comps: Competition[] = [];
  if (vttl) {
    comps.push('Vttl');
  }
  if (sporta) {
    comps.push('Sporta');
  }
  return comps.join(', ');
}


type ActivesTableProps = {
  players: IPlayer[];
  onEditPlayer: Function;
  onUpdatePlayer: Function;
};

const ActivesTable = ({players, onEditPlayer, onUpdatePlayer}: ActivesTableProps) => (
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
              <a href={`mailto:${ply.contact.email}`}>{ply.contact.email}</a>
              <span style={{marginLeft: 20, marginRight: 20}} className="hidden-sm hidden-xs">{`${ply.contact.address}, ${ply.contact.city}`}</span>
              <br className="visible-sm visible-xs" />
              <span>{ply.contact.getMobile()}</span>
            </small>
          </td>
          <td className="hidden-xs">{concatCompetitions(ply.vttl, ply.sporta)}</td>
          <td className="hidden-xs">{ply.security === 'Player' ? '' : ply.security}</td>
          <td>
            <EditButton onClick={() => onEditPlayer(ply)} style={{fontSize: 26}} />

            {keepTrackOfPlayerKeys ? (
              <button
                type="button"
                className="btn btn-default"
                style={{marginLeft: 5}}
                onClick={() => {
                  ply.hasKey = ply.hasKey === false ? null : !ply.hasKey;
                  onUpdatePlayer(ply, {activeChanged: true});
                }}
              >
                <Icon fa="fa fa-key fa-2x" color={ply.hasKey ? 'green' : (ply.hasKey === false ? 'red' : undefined)} />
              </button>
            ) : null}

            {!ply.vttl && !ply.sporta ? (
              <button
                type="button"
                className="btn btn-default"
                style={{marginLeft: 10}}
                onClick={() => {
                  ply.active = false;
                  ply.quitYear = moment().year();
                  ply.security = 'Player';
                  onUpdatePlayer(ply, {activeChanged: true});
                }}
              >
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


type InactivesTableProps = {
  players: IPlayer[];
  onUpdatePlayer: Function;
  onDeletePlayer: Function;
};


const InactivesTable = ({players, onUpdatePlayer, onDeletePlayer}: InactivesTableProps) => (
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
              type="button"
              className="btn btn-default"
              onClick={() => {
                ply.active = true;
                ply.quitYear = null;
                ply.security = 'Player';
                onUpdatePlayer(ply, {activeChanged: true});
              }}
            >
              Recreant activeren
            </button>

            <button
              type="button"
              style={{marginLeft: 8}}
              className="btn btn-default"
              onClick={() => onDeletePlayer(ply)}
            >
              Permanent verwijderen
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);


export default withViewport(connect(() => ({}), {updatePlayer, frenoySync, deletePlayer})(AdminPlayers));
