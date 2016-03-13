import React from 'react';

import Icon from './Icon.js';
import Telephone from './Telephone.js';
import Website from './Website.js';

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
    {loc.website ? (<Website site={loc.website} description={t('match.club.websiteKnown')} />) : (<div>{t('match.club.websiteUnknown')}</div>)}
  </div>
);

export default Location;