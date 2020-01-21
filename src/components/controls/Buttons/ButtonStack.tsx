import React from 'react';
import cn from 'classnames';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import {IConfig} from '../../../models/model-interfaces';


type ButtonStackProps = {
  small?: boolean;
  config: IConfig;
  activeView: string;
  onClick: Function;
  id: 'team-view' | string,
}


export const ButtonStack = ({small, config, activeView, onClick, id = 'team-view'}: ButtonStackProps) => {
  if (small) {
    return (
      <DropdownButton title={(config.find(x => x.key === activeView) || {text: activeView}).text} id={id}>
        {config.map(button => (
          <MenuItem eventKey={button.key} key={button.key} onSelect={onClick.bind(null, button.key)}>{button.text}</MenuItem>
        ))}
      </DropdownButton>
    );
  }
  return (
    <div className="btn-group">
      {config.map(button => (
        <button
          className={cn('btn', button.key === activeView ? 'btn-info' : 'btn-default')}
          key={button.key}
          onClick={onClick.bind(null, button.key)}
          type="button"
        >
          {button.text}
        </button>
      ))}
    </div>
  );
};
