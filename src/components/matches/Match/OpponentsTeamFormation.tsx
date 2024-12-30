import React from 'react';
import Table from 'react-bootstrap/Table';
import { getOpponentFormations } from '../../../storeUtil';
import { PlayerRankings } from '../controls/MatchPlayerRankings';
import { t } from '../../../locales';
import { IMatch, ITeamOpponent } from '../../../models/model-interfaces';

type OpponentsTeamFormationProps = {
  matches: IMatch[];
  opponent?: ITeamOpponent;
  hideHeader?: boolean;
}

export const OpponentsTeamFormation = ({matches, opponent, hideHeader}: OpponentsTeamFormationProps) => {
  const formations = getOpponentFormations(matches, opponent);

  return (
    <Table size="sm" striped style={{maxWidth: 250}}>
      {!hideHeader ? (
        <thead>
          <tr>
            <th colSpan={2}>{t('common.teamFormation')}</th>
            <th style={{width: 80}}>{t('comp.sporta.rankingValue')}</th>
          </tr>
        </thead>
      ) : null}
      <tbody>
        {formations.sort((a, b) => b.value - a.value).map(formation => (
          <tr key={formation.key}>
            <td>{formation.amount}x</td>

            <td>
              <PlayerRankings formation={formation.details} />
            </td>

            <td>{formation.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
