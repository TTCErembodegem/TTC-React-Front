import React from 'react';
import PropTypes from '../PropTypes.js';
import Table from 'react-bootstrap/lib/Table';
import cn from 'classnames';
import {OwnClubId} from '../../models/ClubModel.js';
import storeUtil from '../../storeUtil.js';


export const DivisionRanking = ({team, t}) => {
  return (
    <Table condensed hover>
      <thead>
        <tr>
          <th>{t('teamCalendar.position')}</th>
          <th>{t('teamCalendar.name')}</th>
          <th className="hidden-xs">{t('teamCalendar.matchesWon')}</th>
          <th className="hidden-xs">{t('teamCalendar.matchesLost')}</th>
          <th className="hidden-xs">{t('teamCalendar.matchesDraw')}</th>
          <th>{t('teamCalendar.points')}</th>
        </tr>
      </thead>
      <tbody>
        {team.ranking.map(teamRanking => (
          <tr
            className={cn({'match-won accentuate': teamRanking.clubId === OwnClubId, 'irrelevant': teamRanking.isForfait})}
            key={teamRanking.clubId + teamRanking.teamCode}
          >
            <td>{teamRanking.position}</td>
            <td>{storeUtil.getClub(teamRanking.clubId).name + ' ' + teamRanking.teamCode}</td>
            <td className="hidden-xs">{teamRanking.gamesWon}</td>
            <td className="hidden-xs">{teamRanking.gamesLost}</td>
            <td className="hidden-xs">{teamRanking.gamesDraw}</td>
            <td>{teamRanking.points}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

DivisionRanking.propTypes = {
  t: PropTypes.func.isRequired,
  team: PropTypes.TeamModel.isRequired,
};
