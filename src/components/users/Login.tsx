import React, {Component} from 'react';
import {Link} from 'react-router';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import PropTypes, {connect} from '../PropTypes';
import * as loginActions from '../../actions/userActions';
import PlayerAutoComplete from '../players/PlayerAutoComplete';
import {MaterialButton} from '../controls/Buttons/MaterialButton';

export const paperStyle = {
  width: 290,
  marginTop: 10,
  marginBottom: 10,
  // textAlign: 'center',
  paddingLeft: 10,
  paddingRight: 10,
  display: 'inline-block',
};


class Login extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    login: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      playerId: null,
      password: null,
    };
  }

  render() {
    const {t} = this.context;
    return (
      <Paper style={{...paperStyle, height: 425}}>
        <h3>{t('login.title')}</h3>
        <div>{t('login.introText')}</div>

        <br />

        <PlayerAutoComplete
          selectPlayer={id => this.setState({playerId: id})}
          label={t('login.loginName')}
          style={{margin: 10}}
        />

        <br />

        <TextField
          label={t('login.password')}
          placeholder={t('login.passwordHint')}
          type="password"
          fullWidth
          onChange={e => this.setState({password: e.target.value})}
        />

        <br />
        <br />

        <MaterialButton
          variant="contained"
          label={t('login.loginButton')}
          primary
          style={{marginTop: 15, width: '100%'}}
          onClick={() => this.props.login(this.state)}
          disabled={!this.state.playerId}
        />

        <br />
        <br />
        <Link to={t.route('forgotPassword')} className="pull-right" style={{marginTop: 20, marginRight: 10, fontSize: 18}}>
          {t('password.forgotLink')}
        </Link>
      </Paper>
    );
  }
}

export default connect(() => ({}), loginActions)(Login);
