import React, {Component} from 'react';
import PropTypes from '../../PropTypes';
import {Icon} from './Icon';


export const ThumbsUpIcon = ({style, ...props}) => (
  <Icon
    fa="fa fa-thumbs-o-up"
    color="#D3D3D3"
    translate
    tooltip="teamCalendar.matchesWonBadge"
    style={({marginRight: 5, ...style})}
    {...props}
  />
);

export const ThumbsDownIcon = ({style, ...props}) => (
  <Icon
    fa="fa fa-thumbs-o-down"
    color="#D3D3D3"
    translate
    tooltip="teamCalendar.matchesLostBadge"
    style={({marginRight: 5, ...style})}
    {...props}
  />
);

ThumbsUpIcon.propTypes = {style: PropTypes.object};
ThumbsDownIcon.propTypes = {style: PropTypes.object};



export class ThumbsGreatIcon extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    style: PropTypes.object,
  }

  render() {
    const {t} = this.context;
    return (
      <Icon
        fa="fa fa-thumbs-up"
        style={this.props.style}
        tooltip={t('teamCalendar.matchesWonAllBadge')}
      />
    );
  }
}
