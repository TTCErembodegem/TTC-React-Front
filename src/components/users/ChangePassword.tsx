import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes, {connect} from '../PropTypes';
import * as userActions from '../../actions/userActions';
import {MaterialButton} from '../controls/Buttons/MaterialButton';

class ChangePassword extends Component {
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
          label={this.context.t('password.oldPassword')}
          type="password"
          onChange={e => this.setState({oldpassword: e.target.value})}
        />

        <br />

        <TextField
          label={this.context.t('password.newPassword')}
          type="password"
          onChange={e => this.setState({newpassword: e.target.value})}
        />

        <br />

        <MaterialButton
          variant="contained"
          label={this.context.t('profile.editPassword')}
          primary
          style={{marginTop: 15}}
          onClick={() => this.props.changePassword(this.props.user.playerId, this.state)}
          disabled={!this.state.oldpassword && !this.state.newpassword}
        />

      </div>
    );
  }
}

export default connect(state => ({user: state.user}), userActions)(ChangePassword);
