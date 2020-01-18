// Copy from: https://github.com/nmn/react-timeago
// But translated with jquery-timeago inWords



import _ from 'lodash';
import timeAgoInWords from '../../../utils/timeAgoInWords.js';

const PropTypes = require('prop-types');

const React = require('react');

export class TimeAgo extends React.Component {
  timeoutId = 0;

  static defaultProps = {
    live: true,
    component: 'span',
    minPeriod: 0,
    maxPeriod: Infinity,
  }

  static propTypes = {
    live: PropTypes.bool.isRequired,
    minPeriod: PropTypes.number.isRequired,
    maxPeriod: PropTypes.number.isRequired,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    date: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (this.props.live) {
      this.tick(true);
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.live !== lastProps.live || this.props.date !== lastProps.date) {
      if (!this.props.live && this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
      }
      this.tick();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  tick(refresh) {
    if (!this.isMounted || !this.props.live) {
      return;
    }

    let period = 1000;

    const then = this.props.date.valueOf();
    const now = Date.now();
    const seconds = Math.round(Math.abs(now - then) / 1000);

    if (seconds < 60) {
      period = (60 - seconds) * 1000;
    } else if (seconds < 60 * 60) {
      period = 1000 * 60;
    } else if (seconds < 60 * 60 * 24) {
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
  }

  render() {
    let distanceMillis = new Date().valueOf() - this.props.date.valueOf();
    if (distanceMillis < 0) {
      distanceMillis = 0;
    }

    const props = _.omit(this.props, ['live', 'minPeriod', 'maxPeriod', 'component', 'date']);
    props.title = this.props.date.format('ddd D/M H:mm');

    return React.createElement(this.props.component, props, timeAgoInWords(distanceMillis));
  }
}
