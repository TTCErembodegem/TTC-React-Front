import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import {PlayerAllCompetitions} from '../PlayerCard.js';
import {PlayerPlayingStyle} from '../PlayerPlayingStyle.js';

export const PlayersAllNotLoggedIn = ({players, t}) => {
  return (
    <Table condensed hover className="players">
      <thead>
        <tr>
          <th>{t('player.name')}</th>
          <th>{t('common.competition')}</th>
          <th className="hidden-sm hidden-xs">{t('player.style')}</th>
        </tr>
      </thead>
      <tbody>
        {players.map(ply => {
          return (
            <tr key={ply.id}>
              <td>
                <strong>{ply.name}</strong>
              </td>
              <td>
                <PlayerAllCompetitions player={ply} t={t} />
              </td>
              <td className="hidden-sm hidden-xs">
                <PlayerPlayingStyle ply={ply} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
