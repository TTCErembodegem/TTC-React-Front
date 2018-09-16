import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';

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


@connect(state => ({email: state.config.get('params').email}))
export class OwnEmail extends Component {
  static propTypes = {
    className: PropTypes.string,
    email: PropTypes.string.isRequired,
  };
  render() {
    return <Email email={this.props.email} {...this.props} />;
  }
}
