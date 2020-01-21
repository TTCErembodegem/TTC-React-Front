import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Icon} from '../Icons/Icon';

type SpinnerProps = {
  size: number;
}

export class Spinner extends Component<SpinnerProps> {
  static defaultProps = {
    size: 1,
  };

  render() {
    return (
      <div>
        <Icon fa={`fa fa-spinner fa-pulse fa-${this.props.size}x`} />
      </div>
    );
  }
}


export const FullScreenSpinner = () => (
  <div style={{width: 210, margin: 'auto', paddingTop: 75}}><CircularProgress color="secondary" size={200} /></div>
);
