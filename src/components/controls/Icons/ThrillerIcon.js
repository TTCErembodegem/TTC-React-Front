import React, {PropTypes, Component} from 'react';
import cn from 'classnames';
import {Icon} from './Icon.js';

export const ThrillerIcon = ({color = undefined}) => (
  <Icon fa="fa fa-heartbeat faa-pulse animated" style={{marginLeft: 3, marginRight: 7, marginTop: 3, color: color}} />
);

// Badgy because material-ui also defines a Badge
export const Badgy = ({type, children, style, tooltip}) => (
  <span className={'label label-as-badge ' + type} style={style} title={tooltip}>
    {children}
  </span>
);

export const ThrillerBadge = ({t, match}) => {
  const team = match.getTeam();
  const thrillerType = team.getThriller(match);
  if (thrillerType) {
    const thrillerStyle = {
      position: 'absolute',
      top: 60,
      left: 15,
      fontSize: 16,
      paddingRight: 13,
    };
    return (
      <span className="label label-as-badge label-danger" style={thrillerStyle}>
        <ThrillerIcon />
        {t('match.' + thrillerType)}
      </span>
    );
  }
  return <div />;
};
