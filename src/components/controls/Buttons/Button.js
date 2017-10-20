import React, {Component} from 'react';
import PropTypes, {withTooltip} from '../../PropTypes.js';
import cn from 'classnames';
//import {Icon} from '../Icon.js';


@withTooltip
export class Button extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  render() {
    return (
      <a
        onClick={this.props.onClick}
        className={cn(this.props.className, 'btn btn-default')}
        style={this.props.style}
      >
        {this.props.label}
      </a>
    );
  }
}
