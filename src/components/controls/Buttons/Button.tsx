/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component} from 'react';
import cn from 'classnames';
import PropTypes, {withTooltip} from '../../PropTypes';
import {Icon} from '../Icons/Icon';

export type ButtonComponentProps = {
  onClick: () => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}

class ButtonComponent extends Component<ButtonComponentProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    return (
      <a
        onClick={this.props.onClick}
        className={cn(this.props.className, 'btn btn-default')}
        style={this.props.style}
        role="button"
        tabIndex={0}
      >
        {this.props.label}
      </a>
    );
  }
}

export const Button = withTooltip(ButtonComponent);


export type IconButtonComponentProps = {
  onClick: () => void;
  fa: string;
  className: string;
  style?: React.CSSProperties;
}

class IconButtonComponent extends Component<IconButtonComponentProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    return (
      <a
        onClick={this.props.onClick}
        className={cn(this.props.className, 'btn btn-default')}
        style={this.props.style}
        role="button"
        tabIndex={0}
      >
        <Icon fa={this.props.fa} />
      </a>
    );
  }
}

export const IconButton = withTooltip(IconButtonComponent);
