import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import cn from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import {Icon} from '../Icon.js';

export const SaveButton = ({onClick, title, style}) => (
  <button className="btn btn-default"onClick={onClick} title={title} style={style}>
    <Icon fa="fa fa-floppy-o" />
  </button>
);
