import React, {Component} from 'react';
import PropTypes, {connect, withContext} from '../PropTypes.js';

class IntroClub extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
  };

  render() {
    const inClub = {
      players: this.props.players.size,
      teamsSporta: this.props.teams.filter(t => t.competition === 'Sporta').size,
      teamsVttl: this.props.teams.filter(t => t.competition === 'Vttl').size,
    };

    return (
      <div>
        <h3>{this.context.t('intro.title')}</h3>
        {this.context.t('intro.text', inClub)}
      </div>
    );
  }
}

export default withContext(connect(state => ({
  players: state.players,
  teams: state.teams,
}))(IntroClub));
