import React, {Component} from 'react';
import PropTypes, {browserHistory, withViewport} from '../../PropTypes.js';
import {Icon} from './Icon.js';

@withViewport
export class BackIcon extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
    className: PropTypes.string,
  }

  render() {
    const t = this.context.t;
    const viewWidth = this.props.viewport.width;
    return (
      <Icon
        fa={'fa fa-times-circle ' + (viewWidth > 400 ? 'fa-3x' : 'fa-2x')}
        color="red"
        className={this.props.className}
        onClick={() => browserHistory.goBack()}
        tooltip={t('common.close')}
        tooltipPlacement="left"
      />
    );
  }
}
