import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';

import Panel from 'react-bootstrap/lib/Panel';
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
    if (!comp.ranking) {
      return null;
    }

    const team = player.getTeam(competition);
    return (
      <Panel>
        <Panel.Heading>
          <div style={{fontSize: 22}}>
            {competition} {team ? team.teamCode : null}

            {team ? (
              <span style={{fontSize: 16, marginTop: 5}} className="pull-right">
                <DivisionHeader team={team} withVictoryBadges={false} />
              </span>
            ) : null}
          </div>
        </Panel.Heading>

        <Panel.Body>
          <PlayerIndividual player={player} competition={competition} />

          {(false && comp.nextRanking) ? (
            <div>
              {comp.ranking !== comp.nextRanking ? (
                <span>
                  <b>Nieuw klassement</b>:
                  {comp.ranking}
                  <i className="fa fa-long-arrow-right" style={{marginLeft: 8, marginRight: 8}} />
                  {comp.nextRanking}
                </span>
              ) : (
                <span><b>Behoud klassement</b>: {comp.nextRanking}</span>
              )}
            </div>
          ) : null}
        </Panel.Body>
      </Panel>
    );
  }
}
