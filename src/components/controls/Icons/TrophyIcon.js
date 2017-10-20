import React, {PropTypes} from 'react';
import {Icon} from './Icon.js';

export const TrophyIcon = ({style = undefined, color = '#FCB514'}) => (
  <Icon fa="fa fa-trophy" color={color} style={style} translate tooltip="teamCalendar.matchesWon" />
);

TrophyIcon.propTypes = {
  style: PropTypes.object,
  color: PropTypes.string,
};
