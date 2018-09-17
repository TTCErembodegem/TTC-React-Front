import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import {Link} from 'react-router-dom';

import * as loginActions from '../../actions/userActions.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import {MaterialButton} from '../controls/Button.js';

export const paperStyle = {
  width: 290,
  marginTop: 10,
  marginBottom: 10,
  // textAlign: 'center',
  paddingLeft: 10,
  paddingRight: 10,
  display: 'inline-block',
};

@connect(() => ({}), loginActions)
export default class Login extends Component {
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
    const t = this.context.t;
    return (
      <Paper style={{...paperStyle, height: 400}}>
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

        <MaterialButton variant="contained"
          label={t('login.loginButton')}
          primary={true}
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
