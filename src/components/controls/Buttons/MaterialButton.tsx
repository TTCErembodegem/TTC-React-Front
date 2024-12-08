import React from 'react';
import Button from '@mui/material/Button';

// This transforms the material-ui Button from v0.x to the new API

type MaterialButtonProps = {
  label: string;
  primary?: boolean;
  secondary?: boolean;
  color?: string;
  onClick: Function;

  style?: React.CSSProperties;
  variant: string; // TODO: is primary/secondary/color actually doing something?
}

export class MaterialButton extends React.Component<MaterialButtonProps> {
  getColor(primary: boolean, secondary: boolean, color: string): string {
    if (primary) {
      return 'primary';
    }
    if (secondary) {
      return 'secondary';
    }
    return color;
  }

  render() {
    const {label, primary, secondary, color, ...props} = this.props;
    return (
      <Button {...props} color={this.getColor(primary, secondary, color)}>
        {label}
      </Button>
    );
  }
}
