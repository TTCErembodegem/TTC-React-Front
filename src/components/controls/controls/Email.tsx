import React, {Component} from 'react';
import {connect} from '../../PropTypes';

type EmailProps = {
  email: string;
  className: string;
  showIcon?: boolean;
}

export class Email extends Component<EmailProps> {
  render() {
    const {email} = this.props;
    if (!email) {
      return null;
    }

    if (this.props.showIcon) {
      return (
        <span>
          <i className="fa fa-envelope-o" style={{marginRight: 8}} />
          <a href={`mailto:${email}`} className={this.props.className}>{email}</a>
        </span>
      );
    }

    return (
      <a href={`mailto:${email}`} className={this.props.className}>{email}</a>
    );
  }
}


type OwnEmailProps = {
  email: string;
  className: string;
}

class OwnEmailComponent extends Component<OwnEmailProps> {
  render() {
    return <Email email={this.props.email} {...this.props} />;
  }
}

export const OwnEmail = connect(state => ({email: state.config.get('params').email}))(OwnEmailComponent);
