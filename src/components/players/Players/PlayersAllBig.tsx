import React from 'react';
import Table from 'react-bootstrap/Table';
import cn from 'classnames';
import PropTypes from '../../PropTypes';
import {PlayerAllCompetitions} from '../PlayerCard';
import {PlayerPlayingStyle} from '../PlayerPlayingStyle';
import {PlayerLink} from '../controls/PlayerLink';
import {Email} from '../../controls/controls/Email';
import {Telephone} from '../../controls/controls/Telephone';

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
      {players.map(ply => (
        <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
          <td>
            <strong><PlayerLink player={ply} /></strong>
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
      ))}
    </tbody>
  </Table>
);

PlayersAllBig.propTypes = {
  t: PropTypes.func.isRequired,
  players: PropTypes.PlayerModelList.isRequired,
};
