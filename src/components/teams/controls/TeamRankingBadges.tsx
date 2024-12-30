import React, {Component} from 'react';
import {Badgy} from '../../controls/Icons/ThrillerIcon';
import {Icon} from '../../controls/Icons/Icon';
import { ITeam, ITeamOpponent, ITeamRanking } from '../../../models/model-interfaces';
import { t } from '../../../locales';

type TeamRankingBadgesProps = {
  team: ITeam;
  opponent?: ITeamOpponent;
  style?: React.CSSProperties;
}

export class TeamRankingBadges extends Component<TeamRankingBadgesProps> {
  render() {
    const {team, opponent, ...props} = this.props;
    const ranking = team.getDivisionRanking(opponent);
    if (ranking.empty) {
      return null;
    }

    return <TeamRankingBadgesCore ranking={ranking} {...props} />;
  }
}

type TeamRankingBadgesCoreProps = {
  ranking: ITeamRanking;
  style?: React.CSSProperties;
}

class TeamRankingBadgesCore extends Component<TeamRankingBadgesCoreProps> {
  render() {
    const {ranking} = this.props;
    return (
      <div style={({display: 'inline', ...(this.props.style || {fontSize: 26, marginTop: -10})})}>
        <TeamOverviewBadge amount={ranking.gamesWon} colorClass="match-won" fa="fa-thumbs-up" tooltip={t('teamCalendar.matchesWonBadge')} />
        <TeamOverviewBadge amount={ranking.gamesDraw} colorClass="match-draw" fa="fa-meh-o" tooltip={t('teamCalendar.matchesDrawBadge')} />
        <TeamOverviewBadge amount={ranking.gamesLost} colorClass="match-lost" fa="fa-thumbs-down" tooltip={t('teamCalendar.matchesLostBadge')} />
      </div>
    );
  }
}




const TeamOverviewBadge = ({amount, colorClass, fa, tooltip}: TeamOverviewBadgeProps) => (
  <Badgy type={colorClass} style={{marginLeft: 12}} tooltip={tooltip}>
    <Icon fa={`fa ${fa}`} style={{marginRight: 6}} />
    {amount}
  </Badgy>
);

type TeamOverviewBadgeProps = {
  amount: number,
  colorClass: string,
  fa: string,
  tooltip: string,
};
