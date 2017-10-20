import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes.js';
import {WeekCalcer} from './WeekCalcer.js';
import {Icon} from '../../controls.js';

@withViewport
export class WeekTitle extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    weekCalcer: PropTypes.instanceOf(WeekCalcer).isRequired,
    weekChange: PropTypes.func,
    viewport: PropTypes.viewport,
  }

  render() {
    const weekCalcer = this.props.weekCalcer;
    const week = weekCalcer.getWeek();

    if (!week) {
      return null;
    }

    var extraTitle = null;
    if (this.props.viewport.width > 450) {
      extraTitle = (
        <span>
          :
          &nbsp;
          {week.start.format('D/M')}
          &nbsp;-&nbsp;
          {week.end.format('D/M')}
        </span>
      );
    }


    return (
      <h3 style={{textAlign: 'center'}}>
        {this.props.weekChange ? (
          <Icon
            fa="fa fa-arrow-left"
            style={{marginRight: 10, visibility: weekCalcer.currentWeek > weekCalcer.firstWeek ? '' : 'hidden'}}
            onClick={() => this.props.weekChange(-1)}
            translate tooltip="week.prevWeek" tooltipPlacement="bottom"
          />
        ) : null}

        {this.context.t('match.week')}
        &nbsp;
        {weekCalcer.currentWeek}
        {extraTitle}

        {this.props.weekChange && weekCalcer.currentWeek < weekCalcer.lastWeek ? (
          <Icon
            fa="fa fa-arrow-right"
            style={{marginLeft: 10}}
            onClick={() => this.props.weekChange(1)}
            translate tooltip="week.nextWeek" tooltipPlacement="bottom"
          />
        ) : null}
      </h3>
    );
  }
}
