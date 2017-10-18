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
      <div style={style}>
        <strong>{this.context.t('player.address')}</strong>
        <br />
        {contact.address}
        <br />
        {contact.city}
      </div>
    );
  }
}
