import React, {Component} from 'react';
import PropTypes, {withTooltip} from '../../PropTypes.js';
import cn from 'classnames';
import {Icon} from '../Icon.js';


class ButtonComponent extends Component {
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

export const Button = withTooltip(ButtonComponent);


class IconButtonComponent extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    fa: PropTypes.string.isRequired,
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
        <Icon fa={this.props.fa} />
      </a>
    );
  }
}

export const IconButton = withTooltip(IconButtonComponent);
