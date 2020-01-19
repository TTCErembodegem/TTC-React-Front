import React from 'react';
import PropTypes from '../../PropTypes';
import {Location} from '../../controls/controls/Location';

const OpponentClubLocations = ({club, t}) => (
  <div className="match-card-tab-content">
    <h3>{t('match.club.locationTitle')}</h3>
    <Location loc={club.mainLocation} t={t} />
  </div>
);

OpponentClubLocations.propTypes = {
  club: PropTypes.ClubModel.isRequired,
  t: PropTypes.func.isRequired,
};

export default OpponentClubLocations;
