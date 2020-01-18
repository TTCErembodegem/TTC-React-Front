import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import cn from 'classnames';
import PropTypes from '../../PropTypes';
import {Telephone, Email, PlayerLink} from '../../controls';

export const PlayersAllSmall = ({players, t}) => (
  <Table condensed hover className="players row-by-two">
    <thead>
      <tr>
        <th>{t('player.name')}</th>
        <th>{t('player.address')}</th>
      </tr>
    </thead>
    <tbody>
      {players.map(ply => [
        <tr key={`${ply.id}_name`} className={cn({'match-won': ply.isMe()})}>
          <td colSpan={2}>
            <strong><PlayerLink player={ply} /></strong>
          </td>
        </tr>,
        <tr key={ply.id} className={cn({'match-won': ply.isMe()})}>
          <td className="truncate">
            <Email email={ply.contact.email} />
            <br />
            <Telephone player={ply} hideIcon />
          </td>
          <td>
            {ply.contact.address}
            <br />
            {ply.contact.city}
          </td>
        </tr>,
      ])}
    </tbody>
  </Table>
);

PlayersAllSmall.propTypes = {
  t: PropTypes.func.isRequired,
  players: PropTypes.PlayerModelList.isRequired,
};
