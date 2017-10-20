import React, {Component} from 'react';
import PropTypes, {browserHistory} from '../../PropTypes.js';
import {Icon} from './Icon.js';


export class BackIcon extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    const t = this.context.t;
    return (
      <Icon
        fa="fa fa-times-circle"
        color="red"
        className={this.props.className}
        onClick={() => browserHistory.goBack()}
        tooltip={t('common.close')}
        tooltipPlacement="left"
      />
    );
  }
}
