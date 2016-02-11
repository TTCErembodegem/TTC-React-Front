import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Avatar from 'material-ui/lib/avatar';
import Icon from '../controls/Icon.js';

// TODO: Not yet in use.

@connect(state => {
  return {
    user: state.user,
  };
})
export default class UserAvatar extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  render() {
    if (!this.props.user) {
      return null;
    }

    return (
      <Avatar backgroundColor="#FFB00F" icon={<Icon fa="fa fa-star" />} />
    );
  }
}