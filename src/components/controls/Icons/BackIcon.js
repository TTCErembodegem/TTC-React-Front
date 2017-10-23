import React, {Component} from 'react';
import PropTypes, {browserHistory, withViewport} from '../../PropTypes.js';
import {Icon} from './Icon.js';

@withViewport
export class BackIcon extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
  }

  render() {
    const t = this.context.t;
    const {viewport, ...props} = this.props;
    return (
      <Icon
        fa={'fa fa-times-circle ' + (viewport.width > 400 ? 'fa-3x' : 'fa-2x')}
        color="red"
        onClick={() => browserHistory.goBack()}
        tooltip={t('common.close')}
        tooltipPlacement="left"
        {...props}
      />
    );
  }
}
