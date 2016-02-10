import React from 'react';

import OpponentPlayer from './OpponentPlayer.js';
import OwnPlayer from './OwnPlayer.js';

const MatchPlayers = ({report, team, t}) => (
  <div>
    <div className="col-md-6">
      <h3>{t('match.playersVictoryTitle')}</h3>
      {report.getOwnPlayers().map(ply => (
        <OwnPlayer report={report} ply={ply} team={team} key={ply.position} />
      ))}
    </div>
    <div className="col-md-6">
      <h3>{t('match.playersOpponentsTitle')}</h3>
      {report.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={t} />)}
    </div>
  </div>
);

export default MatchPlayers;