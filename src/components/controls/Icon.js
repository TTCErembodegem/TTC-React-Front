import React, { PropTypes, Component } from 'react';

export default class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    return (<i className={this.props.fa} style={{color: this.props.color, ...this.props.style}}></i>);
  }
}