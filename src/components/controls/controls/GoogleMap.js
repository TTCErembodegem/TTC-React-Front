import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';

// eslint-disable-next-line
const gSource = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5029.712844711129!2d4.047850828108818!3d50.9263729181754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xaf1912d655631a00!2sSportcentrum+Schotte!5e0!3m2!1sen!2sbe!4v1529441837848';

export class GoogleMap extends Component {
  static contextTypes = PropTypes.contextTypes;
  render() {
    return (
      <iframe
        src={gSource}
        frameBorder={0}
        style={{border: 0, width: '100%', height: 450}}
        allowFullScreen
      />
    );
  }
}
