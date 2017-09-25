import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import {WeekCalcer} from './WeekCalcer.js';
import {Icon} from '../../controls.js';

export class WeekTitle extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    weekCalcer: PropTypes.instanceOf(WeekCalcer).isRequired,
    weekChange: PropTypes.func,
  }

  render() {
      const weekCalcer = this.props.weekCalcer;
      const week = weekCalcer.getWeek();

      if (!week) {
        return null;
      }

      return (
        <h3 style={{textAlign: 'center'}}>
          {this.props.weekChange ? (
            <Icon
              fa="fa fa-arrow-left"
              style={{marginRight: 10, visibility: weekCalcer.currentWeek > 1 ? '' : 'hidden'}}
              onClick={() => this.props.weekChange(-1)}
            />
          ) : null}

          {this.context.t('match.week')}
          &nbsp;
          {weekCalcer.currentWeek}
          :
          &nbsp;
          {week.start.format('D/M')}
          &nbsp;-&nbsp;
          {week.end.format('D/M')}

          {this.props.weekChange && weekCalcer.currentWeek < weekCalcer.lastWeek ? (
            <Icon fa="fa fa-arrow-right" style={{marginLeft: 10}} onClick={() => this.props.weekChange(1)} />
          ) : null}
        </h3>
      );
    }
}
