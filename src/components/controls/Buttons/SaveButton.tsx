import React from 'react';
import {Icon} from '../Icons/Icon';
import {ButtonComponentProps} from './Button';

export const SaveButton = ({title, ...props}: ButtonComponentProps & {title: string}) => (
  <button type="button" className="btn btn-default" title={title} {...props}>
    <Icon fa="fa fa-floppy-o" />
  </button>
);
