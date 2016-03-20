import React from 'react';

const Strike = ({text, textStyle, ...props}) => (
  <div className="strike" {...props}><span style={textStyle}>{text}</span></div>
);

export default Strike;