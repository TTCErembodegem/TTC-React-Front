import React, {Component} from 'react';
import PropTypes, {connect, storeUtil, withStyles} from '../../PropTypes.js';
import {Email, Telephone, PlayerAddress, PlayerLink, Strike} from '../../controls.js';
import {TeamRankingBadges} from '../../teams/controls/TeamRankingBadges.js';
import {TeamPlayerAvatars} from '../../teams/controls/TeamPlayerAvatars.js';

export const Kampioenen = ({topTeams}) => {
  if (!topTeams.length) {
    return null;
  }

  return (
    <div className="row kampioen">
      <h2>Onze Kampioenen</h2>
      {topTeams.map(team => (
        <div key={team.id} className="col-md-4 col-sm-6">
          <div className="content">
            <h3>{team.renderOwnTeamTitle()}</h3>
            <b>{team.getDivisionDescription()}</b>
            <TeamRankingBadges team={team} style={{float: 'right'}} />
            <TeamPlayerAvatars team={team} style={{marginTop: 20}} />
          </div>
        </div>
      ))}
    </div>
  );
};
