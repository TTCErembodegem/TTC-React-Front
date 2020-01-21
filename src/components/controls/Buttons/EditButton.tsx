import React from 'react';
import {EditIcon} from '../Icons/EditIcon';
import {IconButtonComponentProps} from './Button';

export const EditButton = ({onClick, title, style, fa}: IconButtonComponentProps & {title: string}) => (
  <button type="button" className="btn btn-default" onClick={onClick} title={title} style={style}>
    <EditIcon className={fa} />
  </button>
);
