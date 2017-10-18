import React from 'react';
import PropTypes from '../../PropTypes.js';
import Button from 'react-bootstrap/lib/Button';
import {CommentIcon} from '../Icon.js';

export const CommentButton = ({onClick, className, style}) => (
  <Button onClick={onClick} className={className} style={style}>
    <CommentIcon />
  </Button>
);

CommentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
};
