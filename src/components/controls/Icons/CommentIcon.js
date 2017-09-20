import React, {PropTypes, Component} from 'react';
import cn from 'classnames';
import {Icon} from './Icon.js';

export const CommentIcon = ({style, color, className}) => (
  <Icon fa="fa fa-comment-o" style={style} className={className} />
);
