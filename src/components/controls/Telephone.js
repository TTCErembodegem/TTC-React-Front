import React, { PropTypes, Component } from 'react';
import Icon from './Icon.js';

export default class Telephone extends Component {
  static propTypes = {
    number: PropTypes.string
  }

  render() {
    if (!this.props.number) {
      return null;
    }

    return (
      <div className="iconize">
        <Icon fa="fa fa-phone" />
        <span style={{marginLeft: 7}}>{this.props.number}</span>
      </div>
    );
  }
}