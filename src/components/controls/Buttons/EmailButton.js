import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from '../../PropTypes.js';
import {Icon} from '../Icon.js';

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
