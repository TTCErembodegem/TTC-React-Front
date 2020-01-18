import React from 'react';
import PropTypes from '../../PropTypes';

export const Strike = ({text, textStyle, ...props}) => (
  <div className="strike" {...props}><span style={{color: 'black', ...textStyle}}>{text}</span></div>
);

Strike.propTypes = {
  text: PropTypes.string,
  textStyle: PropTypes.object,
};
