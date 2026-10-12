import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Table from 'react-bootstrap/Table';
import { Icon } from '../controls/Icons/Icon';
import { t } from '../../locales';
import { fetchToogDone } from '../../reducers/toogReducer';
import { selectPlayers, useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { IToogDone } from '../../models/model-interfaces';

export const AdminToogDone = () => {
  const dispatch = useTtcDispatch();
  const done = useTtcSelector(state => state.toog.done);
  const players = useTtcSelector(selectPlayers);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchToogDone());
  }, [dispatch]);

  if (done.length === 0) {
    return <div style={{ marginTop: 15 }}>{t('admin.toog.noneDone')}</div>;
  }

  const playerName = (playerId: number) => {
    const player = players.find(ply => ply.id === playerId);
    return player ? `${player.firstName} ${player.lastName}` : `#${playerId}`;
  };

  const perPlayer = [...done.reduce((acc, row) => acc.set(row.playerId, [...(acc.get(row.playerId) ?? []), row]), new Map<number, IToogDone[]>()).entries()]
    .map(([playerId, rows]) => ({ playerId, name: playerName(playerId), rows }))
    .sort((a, b) => b.rows.length - a.rows.length || a.name.localeCompare(b.name));

  return (
    <Table size="sm" hover>
      <thead>
        <tr>
          <th>{t('admin.toog.player')}</th>
          <th>{t('admin.toog.times')}</th>
        </tr>
      </thead>
      <tbody>
        {perPlayer.map(({ playerId, name, rows }) => (
          <Fragment key={playerId}>
            <tr style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === playerId ? null : playerId)}>
              <td>
                <Icon fa={`fa fa-chevron-${expanded === playerId ? 'down' : 'right'}`} style={{ marginRight: 8 }} />
                {name}
              </td>
              <td>{rows.length}</td>
            </tr>
            {expanded === playerId && (
              <tr>
                <td colSpan={2}>
                  <Table size="sm" style={{ marginBottom: 0, marginLeft: 20, width: 'auto' }}>
                    <thead>
                      <tr>
                        <th>{t('common.date')}</th>
                        <th>{t('admin.toog.competition')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(row => (
                        <tr key={row.date}>
                          <td>{dayjs(row.date).format('dd DD/MM/YYYY')}</td>
                          <td>{row.competitions.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </Table>
  );
};
