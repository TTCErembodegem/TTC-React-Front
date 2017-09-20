import React, {PropTypes, Component} from 'react';
import cn from 'classnames';
import {Icon} from './Icon.js';

export const TrophyIcon = ({style, color}) => (
  <Icon fa="fa fa-trophy" color={color || '#FCB514'} style={style} />
);
