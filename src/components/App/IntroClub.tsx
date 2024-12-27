import React from 'react';
import { t } from '../../locales';
import { useTtcSelector } from '../../utils/hooks/storeHooks';

export const IntroClub = () => {
  const players = useTtcSelector(state => state.players);
  const teams = useTtcSelector(state => state.teams);
  const inClub = {
    players: players.length,
    teamsSporta: teams.filter(team => team.competition === 'Sporta').length,
    teamsVttl: teams.filter(team => team.competition === 'Vttl').length,
  };

  return (
    <div>
      <h3>{t('intro.title')}</h3>
      {t('intro.text', inClub)}
    </div>
  );
};
