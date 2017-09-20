import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import cn from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import {EditIcon} from '../Icon.js';

export const EditButton = ({onClick, title, style, fa}) => (
  <button className="btn btn-default"onClick={onClick} title={title} style={style}>
    <EditIcon className={fa} />
  </button>
);
