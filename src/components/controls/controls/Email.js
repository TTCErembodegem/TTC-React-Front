import React, {PropTypes, Component} from 'react';
import {OwnClubEmail} from '../../../models/ClubModel.js';

export class Email extends Component {
  static propTypes = {
    email: PropTypes.string,
    className: PropTypes.string,
    showIcon: PropTypes.bool,
  };

  render() {
    const email = this.props.email;
    if (!email) {
      return null;
    }

    if (this.props.showIcon) {
      return (
        <span>
          <i className="fa fa-envelope-o" style={{marginRight: 8}} />
          <a href={'mailto:' + email} className={this.props.className}>{email}</a>
        </span>
      );
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
    return <Email email={OwnClubEmail} {...this.props} />;
  }
}
