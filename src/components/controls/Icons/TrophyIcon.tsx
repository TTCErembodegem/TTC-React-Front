import PropTypes from 'prop-types';
import React from 'react';
import {Icon} from './Icon';

export const TrophyIcon = ({style = undefined, color = '#FCB514'}) => (
  <Icon fa="fa fa-trophy" color={color} style={style} translate tooltip="teamCalendar.matchesWon" />
);

TrophyIcon.propTypes = {
  style: PropTypes.object,
  color: PropTypes.string,
};
