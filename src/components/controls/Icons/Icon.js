import React, {Component} from 'react';
import cn from 'classnames';
import PropTypes, {withTooltip} from '../../PropTypes';

class IconComponent extends Component {
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
        style={{color, ...style}}
      />
    );
  }
}

export const Icon = withTooltip(IconComponent);
