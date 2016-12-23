import React, { PropTypes, Component } from 'react';

import { Icon } from './Icon.js';
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
    {loc.website ? (<Website site={loc.website} description={t('match.club.websiteKnown')} />) : null}
  </div>
);

export default Location;

class Website extends Component {
  static propTypes = {
    site: PropTypes.string,
    description: PropTypes.string
  }

  render() {
    if (!this.props.site) {
      return null;
    }

    return (
      <div className="iconize">
        <Icon fa="fa fa-external-link" />
        <span style={{marginLeft: 7}}><a href={this.props.site} target="_blank">{this.props.description}</a></span>
      </div>
    );
  }
}