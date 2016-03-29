import React, { PropTypes, Component } from 'react';
import Icon from './Icon.js';

export function dispayFormat(n) {
  return n.replace(/^(\d{3,4})(\d{2})(\d{2})(\d{2})$/, '$1/$2 $3 $4');
}

function callFormat(n) {
  return n;
  //return '+32' + n.substr(1);
}

export default class Telephone extends Component {
  static propTypes = {
    number: PropTypes.string.isRequired,
  }

  render() {
    if (!this.props.number) {
      return null;
    }

    var {number, ...props} = this.props;
    return (
      <div className="iconize" {...props}>
        <Icon fa="fa fa-phone" />
        <a style={{marginLeft: 7}} href={'tel:' + callFormat(number)}>{dispayFormat(number)}</a>
      </div>
    );
  }
}