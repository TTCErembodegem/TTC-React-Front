import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes';
import {ButtonStack} from '../controls/Buttons/ButtonStack';
import {IPlayer, ITeam} from '../../models/model-interfaces';

type AdminEmailComponentProps = {
  players: IPlayer[];
  inactivePlayers: IPlayer[];
  teams: ITeam[];
}

type AdminEmailComponentState = {
  filter: 'all' | 'inactive' | 'comp' | 'vttl' | 'sporta';
}

class AdminEmailComponent extends Component<AdminEmailComponentProps, AdminEmailComponentState> {
  static contextTypes = PropTypes.contextTypes;

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
    const viewsConfig = [
      {key: 'all', text: 'Alle'},
      {key: 'comp', text: 'Competitie'},
      {key: 'vttl', text: 'Vttl'},
      {key: 'sporta', text: 'Sporta'},
      {key: 'inactive', text: 'Inactives'},
    ];

    // if (this.state.filter === 'vttl' || this.state.filter === 'sporta')
    // --> also allow filtering on Sporta A, Sporta B etc
    // console.log('teams', this.props.teams.toArray());

    // --> if vttl|sporta: display ranking in badge
    // --> group players per team

    // --> Allow manual player inclusion / exclusion
    // --> button for all board member emails

    // --> and do fix the layout...

    const selectedPlayers = this._filterPlayers().sort((a, b) => a.alias.localeCompare(b.alias));
    const emails = selectedPlayers.filter(p => p.contact && p.contact.email).map(p => `"${p.name}" <${p.contact.email.trim()}>`);
    const emailsWithoutName = selectedPlayers.filter(p => p.contact && p.contact.email).map(p => p.contact.email.trim());

    // "John Smith" <johnsemail@hisserver.com>

    return (
      <div style={{paddingLeft: 15}}>
        <h1>Email adressen</h1>
        <ButtonStack
          config={viewsConfig}
          activeView={this.state.filter}
          onClick={newFilter => this.setState({filter: newFilter})}
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

const PlayerEmail = ({player}: {player: IPlayer}) => (
  <span style={{whiteSpace: 'normal', marginRight: 7, paddingTop: 15}}>
    <span className="label label-as-badge label-success" key={player.id} style={{fontSize: 12, fontWeight: 'normal'}}>
      {player.name}
    </span>
    {' '}
  </span>
);

PlayerEmail.propTypes = {
  player: PropTypes.PlayerModel.isRequired,
};

export const AdminEmail = connect(
  state => ({players: state.players, inactivePlayers: state.admin.players, teams: state.teams}),
)(AdminEmailComponent);
