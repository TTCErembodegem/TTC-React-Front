import React from 'react';

import Icon from './Icon.js';
import Telephone from './Telephone.js';

const Location = ({loc, t}) => (
  <div>
    <div className="iconize">
      <Icon fa="fa fa-map-marker" style={{verticalAlign: 'top'}} />
      {loc.address ? (
        <div>
          <strong>{loc.description}</strong><br />
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

export default Location;