import React, {Component} from 'react';
import PropTypes from '../../PropTypes';
import {Icon, IconProps} from './Icon';


export const ThumbsUpIcon = ({style, ...props}: IconProps) => (
  <Icon
    fa="fa fa-thumbs-o-up"
    color="#D3D3D3"
    translate
    tooltip="teamCalendar.matchesWonBadge"
    style={({marginRight: 5, ...style})}
    {...props}
  />
);

export const ThumbsDownIcon = ({style, ...props}: IconProps) => (
  <Icon
    fa="fa fa-thumbs-o-down"
    color="#D3D3D3"
    translate
    tooltip="teamCalendar.matchesLostBadge"
    style={({marginRight: 5, ...style})}
    {...props}
  />
);



export class ThumbsGreatIcon extends Component<IconProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    const {t} = this.context;
    return (
      <Icon
        fa="fa fa-thumbs-up"
        tooltip={t('teamCalendar.matchesWonAllBadge')}
        {...this.props}
      />
    );
  }
}
