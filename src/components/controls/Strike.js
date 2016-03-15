import React from 'react';

const Strike = ({text, ...props}) => (
  <div className="strike" {...props}><span>{text}</span></div>
);

export default Strike;