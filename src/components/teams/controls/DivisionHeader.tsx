import React, {Component} from 'react';

import {TeamRankingBadges} from './TeamRankingBadges';
import {TeamPosition} from './TeamPosition';
import { ITeam, ITeamOpponent } from '../../../models/model-interfaces';

type DivisionHeaderProps = {
  team: ITeam;
  opponent?: ITeamOpponent;
  withVictoryBadges?: boolean;
}

const resetStyle = {/* reset fontSize */};

export class DivisionHeader extends Component<DivisionHeaderProps> {
  static defaultProps = {
    withVictoryBadges: true,
  };

  render() {
    const {team, opponent, withVictoryBadges} = this.props;
    return (
      <div>
        <TeamPosition team={team} opponent={opponent} />
        {team.getDivisionDescription()}
        {withVictoryBadges ? <TeamRankingBadges team={team} opponent={opponent} style={resetStyle} /> : null}
      </div>
    );
  }
}
