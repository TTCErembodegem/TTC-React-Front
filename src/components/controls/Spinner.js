import React, { PropTypes, Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { Icon } from './Icon.js';

export default class Spinner extends Component {
  static defaultProps = {
    size: 1,
  };

  static propTypes = {
    size: PropTypes.number,
  };

  render() {
    return (
      <div>
        <Icon fa={'fa fa-spinner fa-pulse fa-' + this.props.size + 'x'} />
      </div>
    );
  }
}

export const FullScreenSpinner = () => (
  <div style={{width: 210, margin: 'auto', paddingTop: 75}}><CircularProgress size={3} /></div>
);