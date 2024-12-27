import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import IconButton from '@mui/material/IconButton';
import {OtherMatchPlayerResultsTableRow} from './OtherMatchPlayerResults';
import {MatchPlayerRankings} from '../controls/MatchPlayerRankings';
import {Spinner} from '../../controls/controls/Spinner';
import { IMatch, ITeamOpponent } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';

const AmountOfOpponentMatchesToShow = 5;

type OpponentsLastMatchesProps = {
  opponent: ITeamOpponent;
  readonlyMatches: IMatch[];
}

export const OpponentsLastMatches = ({opponent, readonlyMatches}: OpponentsLastMatchesProps) => {
  const [showAll, setShowAll] = useState(false);
  const [showDetails, setShowDetails] = useState<{[matchId: number]: boolean}>({});
  const viewport = useViewport();

  const widthRemoveColumn = 500; // combine Home&Away columns to just one Opponent column on small devices

  if (!showAll) {
    readonlyMatches = readonlyMatches.slice(0, AmountOfOpponentMatchesToShow);
  }
  if (readonlyMatches.length === 0) {
    // If they haven't played any games yet, the spinner will never go away
    return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
  }

  return (
    <Table size="sm" className="match-card-tab-table">
      <thead>
        <tr>
          <th key="1">{t('common.date')}</th>
          <th key="7" className="d-none d-sm-table-cell">{t('common.frenoy')}</th>
          {viewport.width > widthRemoveColumn ? [
            <th key="2">{t('match.opponents.homeTeam')}</th>,
            <th key="3">{t('match.opponents.awayTeam')}</th>,
          ] : (
            <th key="4">{t('match.opponents.vsTeam')}</th>
          )}
          <th key="5">{t('common.teamFormation')}</th>
          <th key="6">{t('match.opponents.outcome')}</th>
        </tr>
      </thead>
      <tbody>
        {readonlyMatches.map(match => {
          const isHomeMatch = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
          return [
            <tr
              key={match.id}
              className={`clickable ${match.won(opponent) ? 'accentuate success' : ''}`}
              onClick={() => setShowDetails({...showDetails, [match.id]: !showDetails[match.id]})}
            >

              <td key="1">{match.getDisplayDate(viewport.width > widthRemoveColumn ? 'd' : 's')}</td>
              <td key="7" className="d-none d-sm-table-cell">{match.frenoyMatchId}</td>
              {viewport.width > widthRemoveColumn ? [
                <td key="2">{match.getClub('home')?.name} {match.home.teamCode}</td>,
                <td key="3">{match.getClub('away')?.name} {match.away.teamCode}</td>,
              ] : (
                <td key="4">
                  {isHomeMatch ? (
                    `${match.getClub('away')?.name} ${match.away.teamCode}`
                  ) : (
                    `${match.getClub('home')?.name} ${match.home.teamCode}`
                  )}
                </td>
              )}

              <td key="5"><MatchPlayerRankings match={match} homeTeam={isHomeMatch} /></td>

              <td key="6">{match.score.home}&nbsp;-&nbsp;{match.score.out}</td>
            </tr>,
            <OtherMatchPlayerResultsTableRow key="8" show={showDetails[match.id]} match={match} colSpan={5} />,
          ];
        })}
        {!showAll && readonlyMatches.length > AmountOfOpponentMatchesToShow ? (
          <tr key="showAll">
            <td colSpan={5} style={{textAlign: 'center'}}>
              <IconButton onClick={() => setShowAll(true)}>
                <i className="fa fa-chevron-circle-down" />
              </IconButton>
            </td>
          </tr>
        ) : null}
      </tbody>
    </Table>
  );
};
