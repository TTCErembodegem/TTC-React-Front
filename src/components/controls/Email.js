import React, { PropTypes, Component } from 'react';
import cn from 'classnames';

import { OwnClubEmail } from '../../models/ClubModel.js';

export default class Email extends Component {
  static propTypes = {
    email: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    const email = this.props.email;
    if (!email) {
      return null;
    }

    return (
      <a href={'mailto:' + email} className={this.props.className}>{email}</a>
    );
  }
}


export class OwnEmail extends Component {
  static propTypes = {
    className: PropTypes.string,
  };
  render() {
    return <Email email={OwnClubEmail} {...this.props} />
  }
}
