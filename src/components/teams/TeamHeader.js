import React from 'react';
import { Icon, Badgy } from '../controls';

const TeamHeader = ({team, t, showRanking}) => (
  <div>
    <h4 style={{marginLeft: 5}}>
      {team.getDivisionDescription()}
      {showRanking ? <TeamRankingBadges team={team} t={t} /> : null}
    </h4>
  </div>
);


export const TeamTabTitle = ({team, showRanking, t}) => {
  var positionClassName;
  if (team.isTopper()) {
    positionClassName = 'match-won';
  } else if (team.isInDegradationZone()) {
    positionClassName = 'match-lost';
  } else {
    positionClassName = 'label-default';
  }

  const ranking = team.getDivisionRanking();
  return (
    <div>
      {!ranking.empty ? (
        <Badgy type={positionClassName} style={{marginRight: 8, marginTop: -5}}>
          {ranking.position} / {team.ranking.length}
        </Badgy>
      ) : null}
      {team.renderOwnTeamTitle()}
      {showRanking ? (
        <div style={{marginRight: 0}} className="pull-right">
          <TeamRankingBadges team={team} t={t} />
        </div>
      ) : null}
    </div>
  );
}


const TeamRankingBadges = ({team, t}) => {
  const ranking = team.getDivisionRanking();
  if (ranking.empty) {
    return null;
  }

  return (
    <div style={{fontSize: 14, display: 'inline', marginTop: -10}}>
      <TeamOverviewBadge amount={ranking.gamesWon} colorClass="match-won" fa="fa-thumbs-up" tooltip={t('teamCalendar.matchesWon')} />
      <TeamOverviewBadge amount={ranking.gamesDraw} colorClass="match-draw" fa="fa-meh-o" tooltip={t('teamCalendar.matchesDraw')} />
      <TeamOverviewBadge amount={ranking.gamesLost} colorClass="match-lost" fa="fa-thumbs-down" tooltip={t('teamCalendar.matchesLost')} />
    </div>
  );
}

const TeamOverviewBadge = ({amount, colorClass, fa, tooltip}) => {
  return (
    <Badgy type={colorClass} style={{marginLeft: 12}} tooltip={tooltip}>
      <Icon fa={'fa ' + fa} style={{marginRight: 6}} />
      {amount}
    </Badgy>
  );
}

export default TeamHeader;