import React from 'react';
import Button from 'react-bootstrap/Button';
import {CommentIcon} from '../Icons/CommentIcon';
import {ButtonComponentProps} from './Button';

export const CommentButton = (props: Omit<ButtonComponentProps, 'label'>) => (
  <Button {...props}>
    <CommentIcon />
  </Button>
);
