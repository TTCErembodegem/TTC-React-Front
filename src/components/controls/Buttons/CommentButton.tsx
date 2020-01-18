import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from '../../PropTypes';
import {CommentIcon} from '../Icon';

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
