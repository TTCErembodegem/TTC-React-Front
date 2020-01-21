import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import {CommentIcon} from '../Icons/CommentIcon';
import {ButtonComponentProps} from './Button';

export const CommentButton = ({...props}: ButtonComponentProps) => (
  <Button {...props}>
    <CommentIcon />
  </Button>
);
