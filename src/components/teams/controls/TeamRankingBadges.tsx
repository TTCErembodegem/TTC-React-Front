import React, {Component} from 'react';
import PropTypes from '../../PropTypes';
import { Badgy } from '../../controls/Icons/ThrillerIcon';
import { Icon } from '../../controls/Icons/Icon';

export class TeamRankingBadges extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
  }

  render() {
    const {team, opponent, ...props} = this.props;
    const ranking = team.getDivisionRanking(opponent);
    if (ranking.empty) {
      return null;
    }

    return <TeamRankingBadgesCore ranking={ranking} {...props} />;
  }
}

class TeamRankingBadgesCore extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    ranking: PropTypes.shape({
      gamesWon: PropTypes.number.isRequired,
      gamesDraw: PropTypes.number.isRequired,
      gamesLost: PropTypes.number.isRequired,
    }).isRequired,
    style: PropTypes.object,
  }

  render() {
    const {t} = this.context;
    const {ranking} = this.props;
    return (
      <div style={({display: 'inline', ...(this.props.style || {fontSize: 14, marginTop: -10})})}>
        <TeamOverviewBadge amount={ranking.gamesWon} colorClass="match-won" fa="fa-thumbs-up" tooltip={t('teamCalendar.matchesWonBadge')} />
        <TeamOverviewBadge amount={ranking.gamesDraw} colorClass="match-draw" fa="fa-meh-o" tooltip={t('teamCalendar.matchesDrawBadge')} />
        <TeamOverviewBadge amount={ranking.gamesLost} colorClass="match-lost" fa="fa-thumbs-down" tooltip={t('teamCalendar.matchesLostBadge')} />
      </div>
    );
  }
}




const TeamOverviewBadge = ({amount, colorClass, fa, tooltip}) => (
  <Badgy type={colorClass} style={{marginLeft: 12}} tooltip={tooltip}>
    <Icon fa={`fa ${fa}`} style={{marginRight: 6}} />
    {amount}
  </Badgy>
);

TeamOverviewBadge.propTypes = {
  amount: PropTypes.number.isRequired,
  colorClass: PropTypes.string.isRequired,
  fa: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};
