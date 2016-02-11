import React from 'react';

import OpponentPlayer from './OpponentPlayer.js';
import OwnPlayer from './OwnPlayer.js';

const MatchPlayers = ({report, team, t}) => (
  <div className="match-card-tab-content">
    <div>
      <h3>{t('match.playersVictoryTitle')}</h3>
      {report.getOwnPlayers().map(ply => (
        <OwnPlayer report={report} ply={ply} team={team} key={ply.position} />
      ))}
    </div>
    <div>
      <h3>{t('match.playersOpponentsTitle')}</h3>
      {report.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={t} />)}
    </div>
  </div>
);

export default MatchPlayers;