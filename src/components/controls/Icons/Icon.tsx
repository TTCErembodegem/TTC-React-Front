import React, {Component} from 'react';
import cn from 'classnames';
import {withTooltip} from '../../PropTypes';

export type IconProps = {
  fa: string;
  color?: string | undefined;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}

class IconComponent extends Component<IconProps> {
  render() {
    const {fa, color, style, onClick, className, ...props} = this.props;
    if (!onClick) {
      return (
        <i
          {...props}
          className={cn(fa, className, {clickable: !!onClick})}
          style={{color, ...style}}
        />
      );
    }
    return (
      <i
        {...props}
        className={cn(fa, className, {clickable: !!onClick})}
        onClick={onClick}
        style={{color, ...style}}
        role="button"
        tabIndex={0}
      />
    );
  }
}

export const Icon = withTooltip(IconComponent);
