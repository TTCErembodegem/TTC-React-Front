import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';

export class PlayerAddress extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    contact: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
    }),
    style: PropTypes.object,
  };

  render() {
    const {contact, style} = this.props;
    if (!contact.address) {
      return null;
    }

    return (
      <div style={style} className="iconize">
        <i className="fa fa-map-marker" style={{verticalAlign: 'top'}} />
        <div>
          {contact.address}
          <br />
          {contact.city}
        </div>
      </div>
    );
  }
}
