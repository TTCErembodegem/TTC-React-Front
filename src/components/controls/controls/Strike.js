import React from 'react';

export const Strike = ({text, textStyle, ...props}) => (
  <div className="strike" {...props}><span style={{color: 'black', ...textStyle}}>{text}</span></div>
);
