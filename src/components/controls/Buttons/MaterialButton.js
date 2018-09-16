import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from '../../PropTypes.js';

// This transforms the material-ui Button from v0.x to the new API

export class MaterialButton extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    color: PropTypes.string,
  }

  getColor(primary, secondary, color) {
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
