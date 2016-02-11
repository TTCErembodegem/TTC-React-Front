import React, { Component } from 'react';

import Avatar from 'material-ui/lib/avatar';
import Icon from '../controls/Icon.js';

export default class FavoriteMatch extends Component {
  render() {
    return (
      <Avatar backgroundColor="#FFB00F" icon={<Icon fa="fa fa-star" />} />
    );
  }
}