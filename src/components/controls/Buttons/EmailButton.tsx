import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import {Icon} from '../Icons/Icon';
import {ButtonComponentProps} from './Button';

export const EmailButton = ({...props}: ButtonComponentProps) => (
  <Button {...props}>
    <Icon fa="fa fa-envelope-o" />
  </Button>
);
