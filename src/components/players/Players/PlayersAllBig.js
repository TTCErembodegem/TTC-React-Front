import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import cn from 'classnames';
import {PlayerAllCompetitions} from '../PlayerCard.js';
import {PlayerPlayingStyle} from '../PlayerPlayingStyle.js';
import {Telephone, Email} from '../../controls.js';

export const PlayersAllBig = ({players, t}) => (
  <Table condensed hover className="players">
    <thead>
      <tr>
        <th>{t('player.name')}</th>
        <th>{t('player.address')}</th>
        <th>{t('common.competition')}</th>
        <th className="hidden-sm hidden-xs">{t('player.style')}</th>
      </tr>
    </thead>
    <tbody>
      {players.map(ply => {
        return (
          <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
            <td>
              <strong>{ply.name}</strong>
              <br />
              <Email email={ply.contact.email} />
              <br />
              <Telephone player={ply} hideIcon />
            </td>
            <td>
              {ply.contact.address}
              <br />
              {ply.contact.city}
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
