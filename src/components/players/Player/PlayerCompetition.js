import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';

import {DivisionHeader} from '../../teams/controls/DivisionHeader.js';
import {PlayerIndividual} from './PlayerIndividual.js';

export class PlayerCompetition extends Component {
  static propTypes = {
    player: PropTypes.PlayerModel.isRequired,
    competition: PropTypes.oneOf(['Vttl', 'Sporta']).isRequired,
  }

  render() {
    const {player, competition} = this.props;
    const comp = player.getCompetition(competition);
    if (!comp) {
      return null;
    }

    const team = player.getTeam(competition);
    return (
      <div>
        <h2>
          {competition} {team ? team.teamCode : null}
          <br />
          <DivisionHeader team={team} withVictoryBadges={false} />
        </h2>
        <PlayerIndividual player={player} competition={competition} />
      </div>
    );
  }
}
