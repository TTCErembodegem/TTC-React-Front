import React, { Component } from 'react';
import PropTypes, { connect } from '../../PropTypes.js';
import cn from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import { Icon } from '../Icon.js';

export const CommentButton = ({onClick, className, style}) => (
  <Button onClick={onClick} className={className} style={style}>
    <Icon fa="fa fa-comment-o" />
  </Button>
);
