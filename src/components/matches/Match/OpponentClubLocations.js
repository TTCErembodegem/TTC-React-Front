import React from 'react';

import Icon from '../../controls/Icon.js';
import Telephone from '../../controls/Telephone.js';

const OpponentClubLocations = ({club, t}) => (
  <div className="match-card-tab-content">
    <OpponentClubLocation loc={club.mainLocation} t={t} />
  </div>
);

const OpponentClubLocation = ({loc, t}) => (
  <div>
    <h3>{t('match.club.locationTitle')}</h3>
    <div className="iconize">
      <Icon fa="fa fa-map-marker" style={{verticalAlign: 'top'}} />
      {loc.address ? (
        <div>
          {loc.description}<br />
          {loc.address}<br />
          {loc.postalCode + ' ' + loc.city}
        </div>
      ) : (
        <div>{t('match.club.locationUnknown')}</div>
      )}
    </div>
    <Telephone number={loc.mobile} />
  </div>
);

export default OpponentClubLocations;