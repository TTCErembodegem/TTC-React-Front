import React, {Component} from 'react';
import PropTypes, {connect, withViewport, storeUtil} from '../PropTypes.js';

import Button from 'react-bootstrap/lib/Button';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';
import PlayerLinup from '../users/PlayerLineup.js';

@connect(state => ({matches: state.matches}))
@withViewport
export default class AdminPlayerLineup extends React.Component {
  static propTypes = {
    matches: PropTypes.MatchModelList,
    viewport: PropTypes.viewport,
  }
  constructor() {
    super();
    this.state = {comp: 'Vttl', playerId: null};
  }

  render() {
    var playerFormation;
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

class AdminPlayerLineupToolbar extends Component {
  static propTypes = {
    onFilterChange: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {playerId: null};
  }
  render() {
    const onFilterChange = this.props.onFilterChange;
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
