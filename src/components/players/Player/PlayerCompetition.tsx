import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import PropTypes from '../../PropTypes';

import {DivisionHeader} from '../../teams/controls/DivisionHeader';
import {PlayerIndividual} from './PlayerIndividual';

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
      <Card>
        <Card.Header>
          <div style={{fontSize: 22}}>
            {competition} {team ? team.teamCode : null}

            {team ? (
              <span style={{fontSize: 16, marginTop: 5}} className="pull-right">
                <DivisionHeader team={team} withVictoryBadges={false} />
              </span>
            ) : null}
          </div>
        </Card.Header>

        <Card.Body>
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
        </Card.Body>
      </Card>
    );
  }
}
