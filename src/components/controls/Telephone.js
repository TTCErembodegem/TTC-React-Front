import React, { PropTypes, Component } from 'react';
import { Icon } from './Icon.js';

export function displayFormat(n) {
  if (!n) {
    return '';
  }
  return n.replace(/^(\d{3,4})(\d{2})(\d{2})(\d{2})$/, '$1/$2 $3 $4');
}

function callFormat(n) {
  return n;
  //return '+32' + n.substr(1);
}

export default class Telephone extends Component {
  static propTypes = {
    number: PropTypes.string,
    hideIcon: PropTypes.bool,
  }
  static defaultProps = {
    hideIcon: false
  }

  render() {
    if (!this.props.number) {
      return null;
    }

    var {number, hideIcon, ...props} = this.props;
    if (hideIcon) {
      return <a href={'tel:' + callFormat(number)} {...props}>{displayFormat(number)}</a>;
    }

    return (
      <div className="iconize" {...props}>
        <Icon fa="fa fa-phone" />
        <a style={{marginLeft: 7}} href={'tel:' + callFormat(number)}>{displayFormat(number)}</a>
      </div>
    );
  }
}