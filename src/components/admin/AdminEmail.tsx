import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonStack } from '../controls/Buttons/ButtonStack';
import { IStorePlayer } from '../../models/model-interfaces';
import { RootState } from '../../store';

type AdminEmailComponentProps = {
  players: IStorePlayer[];
  inactivePlayers: IStorePlayer[];
}

type Pages = 'all' | 'inactive' | 'comp' | 'vttl' | 'sporta';

type AdminEmailComponentState = {
  filter: Pages;
}

class AdminEmailComponent extends Component<AdminEmailComponentProps, AdminEmailComponentState> {
  constructor(props) {
    super(props);
    this.state = {filter: 'all'};
  }

  _filterPlayers() {
    const {filter} = this.state;
    if (filter === 'inactive') {
      return this.props.inactivePlayers.filter(p => !p.active);
    }

    const allPlayers = this.props.players;
    const players = allPlayers.filter(p => p.active);
    switch (filter) {
      case 'comp':
        return players.filter(p => p.vttl || p.sporta);
      case 'vttl':
        return players.filter(p => p.vttl);
      case 'sporta':
        return players.filter(p => p.sporta);
      default:
        return players;
    }
  }

  render() {
    const viewsConfig: {key: Pages, text: string}[] = [
      {key: 'all', text: 'Alle'},
      {key: 'comp', text: 'Competitie'},
      {key: 'vttl', text: 'Vttl'},
      {key: 'sporta', text: 'Sporta'},
      {key: 'inactive', text: 'Inactives'},
    ];

    const selectedPlayers = this._filterPlayers().sort((a, b) => a.alias.localeCompare(b.alias));
    const emails = selectedPlayers.filter(p => p.contact && p.contact.email).map(p => `"${p.firstName} ${p.lastName}" <${p.contact.email.trim()}>`);
    const emailsWithoutName = selectedPlayers.filter(p => p.contact && p.contact.email).map(p => p.contact.email.trim());

    // "John Smith" <johnsemail@hisserver.com>

    return (
      <div style={{paddingLeft: 15}}>
        <h1>Email adressen</h1>
        <ButtonStack
          config={viewsConfig}
          activeView={this.state.filter}
          onClick={newFilter => this.setState({filter: newFilter as Pages})}
        />

        <span style={{marginLeft: 6}}>
          # {selectedPlayers.length}
        </span>

        <div className="row" style={{marginTop: 25}}>
          <div className="col-md-6">
            {selectedPlayers.map(p => <PlayerEmail player={p} key={p.id} />)}
          </div>

          <div className="col-md-6">
            <textarea
              style={{width: '100%', height: 300}}
              value={emails.join('\n')}
              onChange={() => true}
            />
          </div>

          <div className="col-md-6">
            <textarea
              style={{width: '100%', height: 300}}
              value={emailsWithoutName.join(';\n')}
              onChange={() => true}
            />
          </div>
        </div>
      </div>
    );
  }
}

const PlayerEmail = ({player}: {player: IStorePlayer}) => (
  <span style={{whiteSpace: 'normal', marginRight: 7, paddingTop: 15}}>
    <span className="label label-as-badge label-success" key={player.id} style={{fontSize: 12, fontWeight: 'normal'}}>
      {player.firstName} {player.lastName}
    </span>
    {' '}
  </span>
);


export const AdminEmail = connect(
  (state: RootState) => ({
    players: state.players,
    inactivePlayers: state.playersQuitters,
  }),
)(AdminEmailComponent);
