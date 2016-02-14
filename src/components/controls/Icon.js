import React, { PropTypes, Component } from 'react';
import cn from 'classnames';

export default class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    return (
      <i
        className={cn(this.props.fa, this.props.className, {
          clickable: !!this.props.onClick,
        })}
        onClick={this.props.onClick}
        style={{color: this.props.color, ...this.props.style}}></i>
    );
  }
}