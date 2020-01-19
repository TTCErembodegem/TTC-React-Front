import React from 'react';
import PropTypes from '../../PropTypes';
import {Icon} from '../Icons/Icon';

export const SaveButton = ({onClick, title, style}) => (
  <button className="btn btn-default" onClick={onClick} title={title} style={style}>
    <Icon fa="fa fa-floppy-o" />
  </button>
);

SaveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};
