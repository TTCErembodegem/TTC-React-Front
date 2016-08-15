// Copy from: https://github.com/nmn/react-timeago
// But translated with jquery-timeago inWords
'use strict';

import timeAgoInWords from '../../utils/timeAgoInWords.js';
import _ from 'lodash';

const React = require('react');

module.exports = React.createClass({
  displayName: 'Time-Ago',
  timeoutId: 0,
  getDefaultProps: function() {
    return {
      live: true,
      component: 'span',
      minPeriod: 0,
      maxPeriod: Infinity,
    };
  },
  propTypes: {
    live: React.PropTypes.bool.isRequired,
    minPeriod: React.PropTypes.number.isRequired,
    maxPeriod: React.PropTypes.number.isRequired,
    component: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func]).isRequired,
    date: React.PropTypes.object.isRequired,
  },
  componentDidMount: function() {
    if (this.props.live) {
      this.tick(true);
    }
  },
  componentDidUpdate: function(lastProps) {
    if (this.props.live !== lastProps.live || this.props.date !== lastProps.date) {
      if (!this.props.live && this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
      }
      this.tick();
    }
  },
  componentWillUnmount: function() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  },
  tick: function(refresh) {
    if (!this.isMounted() || !this.props.live) {
      return;
    }

    var period = 1000;

    const then = this.props.date.valueOf();
    const now = Date.now();
    const seconds = Math.round(Math.abs(now - then) / 1000);

    if (seconds < 60) {
      period = (60 - seconds) * 1000;
    } else if (seconds < 60*60) {
      period = 1000 * 60;
    } else if (seconds < 60*60*24) {
      period = 1000 * 60 * 60;
    } else {
      period = 0;
    }

    period = Math.min(Math.max(period, this.props.minPeriod), this.props.maxPeriod);

    if (period) {
      this.timeoutId = setTimeout(this.tick, period);
    }

    if (!refresh) {
      this.forceUpdate();
    }
  },
  render: function() {
    var distanceMillis = new Date().valueOf() - this.props.date.valueOf();
    if (distanceMillis < 0) {
      distanceMillis = 0;
    }

    var props = _.omit(this.props, ['live', 'minPeriod', 'maxPeriod', 'component', 'date']);
    props.title = this.props.date.format('ddd D/M H:mm');

    return React.createElement(this.props.component, props, timeAgoInWords(distanceMillis));
  }
});