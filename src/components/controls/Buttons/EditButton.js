import React from 'react';
import PropTypes from '../../PropTypes.js';
import {EditIcon} from '../Icon.js';

export const EditButton = ({onClick, title, style, fa}) => (
  <button className="btn btn-default" onClick={onClick} title={title} style={style}>
    <EditIcon className={fa} />
  </button>
);

EditButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  style: PropTypes.object,
  fa: PropTypes.string,
};
