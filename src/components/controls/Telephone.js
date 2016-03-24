import React, { PropTypes, Component } from 'react';
import Icon from './Icon.js';

export default class Telephone extends Component {
  static propTypes = {
    number: PropTypes.string,
  }

  render() {
    if (!this.props.number) {
      return null;
    }

    var {number, ...props} = this.props;
    return (
      <div className="iconize" {...props}>
        <Icon fa="fa fa-phone" />
        <span style={{marginLeft: 7}}>{number}</span>
      </div>
    );
  }
}