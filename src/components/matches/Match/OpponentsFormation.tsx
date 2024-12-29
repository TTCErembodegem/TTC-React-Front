import React from 'react';
import Table from 'react-bootstrap/Table';
import { OpponentPlayerLabel } from './OpponentPlayer';
import { Spinner } from '../../controls/controls/Spinner';
import { ThumbsUpIcon, ThumbsDownIcon } from '../../controls/Icons/ThumbsIcons';
import { ITeamOpponent, IMatch } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';
import storeUtil from '../../../storeUtil';

type OpponentsFormationProps = {
  match: IMatch,
  opponent: ITeamOpponent,
}

export const OpponentsFormation = ({match, opponent}: OpponentsFormationProps) => {
  const viewport = useViewport();
  const formations = storeUtil.matches
    .getFormation(match, opponent)
    .sort((a, b) => b.count - a.count);

  if (formations.length === 0) {
    return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
  }

  const showTimesPlayed = viewport.width > 600;

  return (
    <Table size="sm" striped className="match-card-tab-table">
      <thead>
        <tr>
          <th>{t('match.opponents.player')}</th>
          {showTimesPlayed ? <th>{t('match.opponents.timesPlayed')}</th> : null}
          <th colSpan={2}>{t('match.opponents.victories')}</th>
        </tr>
      </thead>
      <tbody>
        {formations.map(f => (
          <tr key={f.player.uniqueIndex}>
            <td>
              <OpponentPlayerLabel player={f.player} competition={match.competition} />
            </td>
            {showTimesPlayed ? <td>{f.count}</td> : null}
            <td>
              <ThumbsUpIcon />
              {f.won}

              <ThumbsDownIcon style={{marginLeft: 8}} />
              {f.lost}
            </td>
            <td>{`${((f.won / (f.lost + f.won)) * 100).toFixed(0)}%`}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
