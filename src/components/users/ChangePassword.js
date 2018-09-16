import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import * as userActions from '../../actions/userActions.js';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

@connect(state => {
  return {
    user: state.user,
  };
}, userActions)
export default class ChangePassword extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    user: PropTypes.UserModel.isRequired,
    changePassword: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      oldpassword: null,
      newpassword: null,
    };
  }

  render() {
    const paperStyle = {
      marginLeft: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    return (
      <div style={paperStyle}>
        <h3>{this.context.t('password.changeTitle')}</h3>

        <TextField
          floatingLabelText={this.context.t('password.oldPassword')}
          type="password"
          onChange={e => this.setState({oldpassword: e.target.value})} />

        <br />

        <TextField
          floatingLabelText={this.context.t('password.newPassword')}
          type="password"
          onChange={e => this.setState({newpassword: e.target.value})} />

        <br />

        <Button variant="contained"
          label={this.context.t('profile.editPassword')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => this.props.changePassword(this.props.user.playerId, this.state)}
          disabled={!this.state.oldpassword && !this.state.newpassword} />

      </div>
    );
  }
}
