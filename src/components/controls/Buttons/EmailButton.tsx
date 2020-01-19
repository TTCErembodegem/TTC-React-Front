import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from '../../PropTypes';
import {Icon} from '../Icons/Icon';

export const EmailButton = ({onClick, className, style}) => (
  <Button onClick={onClick} className={className} style={style}>
    <Icon fa="fa fa-envelope-o" />
  </Button>
);

EmailButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};
