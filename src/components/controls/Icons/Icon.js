import React, {Component} from 'react';
import PropTypes, {withTooltip} from '../../PropTypes.js';
import cn from 'classnames';

@withTooltip
export class Icon extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    const {fa, color, style, onClick, className, ...props} = this.props;
    return (
      <i
        {...props}
        className={cn(fa, className, {clickable: !!onClick})}
        onClick={onClick}
        style={{color: color, ...style}}
      />
    );
  }
}
