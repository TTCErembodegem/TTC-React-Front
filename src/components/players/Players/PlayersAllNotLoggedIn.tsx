import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import PropTypes from '../../PropTypes';
import {PlayerAllCompetitions} from '../PlayerCard';
import {PlayerPlayingStyle} from '../PlayerPlayingStyle';
import {PlayerLink} from '../../controls';

export const PlayersAllNotLoggedIn = ({players, t}) => (
  <Table condensed hover className="players">
    <thead>
      <tr>
        <th>{t('player.name')}</th>
        <th>{t('common.competition')}</th>
        <th className="hidden-sm hidden-xs">{t('player.style')}</th>
      </tr>
    </thead>
    <tbody>
      {players.map(ply => (
        <tr key={ply.id}>
          <td>
            <strong><PlayerLink player={ply} /></strong>
          </td>
          <td>
            <PlayerAllCompetitions player={ply} t={t} />
          </td>
          <td className="hidden-sm hidden-xs">
            <PlayerPlayingStyle ply={ply} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

PlayersAllNotLoggedIn.propTypes = {
  t: PropTypes.func.isRequired,
  players: PropTypes.PlayerModelList.isRequired,
};
