import React from 'react';
import PropTypes from '../../PropTypes.js';
import {Icon} from './Icon.js';

export const CommentIcon = ({style, className}) => (
  <Icon fa="fa fa-comment-o" style={style} className={className} />
);

CommentIcon.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
};
