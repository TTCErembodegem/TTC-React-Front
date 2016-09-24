import React, { Component } from 'react';
import PropTypes from '../PropTypes.js';

export default class GoogleMap extends Component {
  static contextTypes = PropTypes.contextTypes;
  render() {
    return (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2515.3851757864227!2d4.037142851583363!3d50.91659147944192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3bd3c04b709a9%3A0x867b1c17caea9b21!2sTTC+Erembodegem!5e0!3m2!1sen!2sbe!4v1474673934366"
        frameBorder={0}
        style={{border: 0, width: '100%', height: 450}}
        allowFullScreen>
      </iframe>
    );
  }
}
