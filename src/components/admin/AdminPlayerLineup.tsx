import React, {Component} from 'react';
import Button from 'react-bootstrap/lib/Button';
import {connect, withViewport, storeUtil} from '../PropTypes';

import PlayerAutoComplete from '../players/PlayerAutoComplete';
import PlayerLinup from '../users/PlayerLineup';
import {IMatch, Viewport, Competition} from '../../models/model-interfaces';


type AdminPlayerLineupProps = {
  matches: IMatch[];
  viewport: Viewport;
}

type AdminPlayerLineupState = {
  comp: Competition;
  playerId: null | number;
}


class AdminPlayerLineup extends React.Component<AdminPlayerLineupProps, AdminPlayerLineupState> {
  constructor(props) {
    super(props);
    this.state = {comp: 'Vttl', playerId: null};
  }

  render() {
    let playerFormation;
    if (this.state.playerId) {
      const team = storeUtil.getPlayer(this.state.playerId).getTeam(this.state.comp);

      if (!team) {
        playerFormation = (
          <div>Heeft geen vaste ploeg ingesteld (Geen Standard/Captain, misschien enkel als Reserve?)</div>
        );
      } else {
        playerFormation = (
          <PlayerLinup playerId={this.state.playerId} teams={[team]} />
        );
      }
    }

    return (
      <div>
        <AdminPlayerLineupToolbar onFilterChange={(comp, playerId) => this.setState({comp, playerId})} />
        {playerFormation}
      </div>
    );
  }
}

type AdminPlayerLineupToolbarProps = {
  onFilterChange: Function;
}

type AdminPlayerLineupToolbarState = {
  playerId: null | number;
}

class AdminPlayerLineupToolbar extends Component<AdminPlayerLineupToolbarProps, AdminPlayerLineupToolbarState> {
  constructor(props) {
    super(props);
    this.state = {playerId: null};
  }

  render() {
    const {onFilterChange} = this.props;
    return (
      <div style={{padding: 10, display: 'inline-block', width: 300}}>
        <PlayerAutoComplete
          selectPlayer={playerId => this.setState({playerId})}
          placeholder="Selecteer speler"
        />
        <div style={{marginTop: 10}}>
          <Button bsStyle="info" style={{marginRight: 10}} onClick={() => onFilterChange('Vttl', this.state.playerId)}>Vttl</Button>
          <Button bsStyle="info" onClick={() => onFilterChange('Sporta', this.state.playerId)}>Sporta</Button>
        </div>
      </div>
    );
  }
}

export default withViewport(connect(state => ({matches: state.matches}))(AdminPlayerLineup));
