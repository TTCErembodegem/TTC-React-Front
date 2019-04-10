import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes, {connect, storeUtil, withStyles} from '../../PropTypes.js';
import {TrophyIcon} from '../../controls.js';
import {TeamRankingBadges} from '../../teams/controls/TeamRankingBadges.js';
import {TeamPlayerAvatars} from '../../teams/controls/TeamPlayerAvatars.js';

export const Kampioenen = ({topTeams, t}) => {
  if (!topTeams.length) {
    return null;
  }

  return (
    <div className="row kampioen">
      <h2>
        <TrophyIcon style={{marginRight: 15}} />
        Onze Kampioenen
        <TrophyIcon style={{marginLeft: 15}} />
      </h2>
      {topTeams.map(team => (
        <div key={team.id} className="col-md-4 col-sm-6">
          <div className="content">
            <h3>
              <Link to={t.route('teams').replace(':competition', team.competition) + '/' + team.teamCode} className="link-hover-underline">
                {team.renderOwnTeamTitle()}
              </Link>
            </h3>
            <b>{team.getDivisionDescription()}</b>
            <TeamRankingBadges team={team} style={{float: 'right'}} />
            <TeamPlayerAvatars team={team} style={{marginTop: 20}} />
          </div>
        </div>
      ))}
    </div>
  );
};
