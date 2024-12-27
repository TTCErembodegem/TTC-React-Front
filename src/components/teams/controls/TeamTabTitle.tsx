import React, { Component } from 'react';
import { TeamRankingBadges } from './TeamRankingBadges';
import { TeamPosition } from './TeamPosition';
import { ITeam, ITeamOpponent } from '../../../models/model-interfaces';

type TeamTabTitleProps = {
  team: ITeam;
  showRanking: boolean;
  opponent?: ITeamOpponent;
}

export class TeamTabTitle extends Component<TeamTabTitleProps> {
  render() {
    const {team, opponent, showRanking} = this.props;
    return (
      <div>
        <TeamPosition team={team} opponent={opponent} />
        {team.renderOwnTeamTitle()}
        {showRanking ? (
          <div style={{marginRight: 0}} className="pull-right">
            <TeamRankingBadges team={team} opponent={opponent} />
          </div>
        ) : null}
      </div>
    );
  }
}
