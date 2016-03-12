import React from 'react';

import Location from '../../controls/Location.js';

const OpponentClubLocations = ({club, t}) => (
  <div className="match-card-tab-content">
    <h3>{t('match.club.locationTitle')}</h3>
    <Location loc={club.mainLocation} t={t} />
  </div>
);

export default OpponentClubLocations;