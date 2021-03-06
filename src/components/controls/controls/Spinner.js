import PropTypes from 'prop-types';
import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Icon} from '../Icons/Icon.js';

export class Spinner extends Component {
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
  <div style={{width: 210, margin: 'auto', paddingTop: 75}}><CircularProgress color="secondary" size={200} /></div>
);
