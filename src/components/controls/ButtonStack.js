import React from 'react';
import cn from 'classnames';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

const ButtonStack = ({small, config, activeView, onClick}) => {
  if (small) {
    return (
      <DropdownButton title={(config.find(x => x.key === activeView) || {text: activeView}).text} id="team-view">
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
          onClick={onClick.bind(null, button.key)}>
          {button.text}
        </button>
      ))}
    </div>
  );
};

export default ButtonStack;