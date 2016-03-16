import React, { PropTypes, Component } from 'react';

const PlayerPlayingStyle = ({ply}) => (
  <span>{ply.style.name}<br />{ply.style.bestStroke}</span>
);

export default PlayerPlayingStyle;