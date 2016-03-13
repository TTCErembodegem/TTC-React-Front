import React, { PropTypes, Component } from 'react';
import Icon from './Icon.js';

export default class Website extends Component {
  static propTypes = {
    site: PropTypes.string,
    description: PropTypes.string
  }

  render() {
    if (!this.props.site) {
      return null;
    }

    return (
      <div className="iconize">
        <Icon fa="fa fa-external-link" />
        <span style={{marginLeft: 7}}><a href={this.props.site} target="_blank">{this.props.description}</a></span>
      </div>
    );
  }
}