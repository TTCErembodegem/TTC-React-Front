import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes.js';
import {Link} from 'react-router-dom';

import * as loginActions from '../../actions/userActions.js';
import PlayerAutoComplete from '../players/PlayerAutoComplete.js';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

export const paperStyle = {
  width: 290,
  marginTop: 10,
  marginBottom: 10,
  textAlign: 'center',
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
      <Paper zDepth={1} style={{...paperStyle, height: 360}}>
        <h3>{t('login.title')}</h3>
        <div style={{textAlign: 'left', marginLeft: 15}}>{t('login.introText')}</div>
        <PlayerAutoComplete
          selectPlayer={id => this.setState({playerId: id})}
          floatingLabelText={t('login.loginName')} />

        <TextField
          floatingLabelText={t('login.password')}
          hintText={t('login.passwordHint')}
          hintStyle={{fontSize: 14}}
          type="password"
          onChange={e => this.setState({password: e.target.value})} />

        <Button variant="contained"
          label={t('login.loginButton')}
          primary={true}
          style={{marginTop: 15}}
          onClick={() => this.props.login(this.state)}
          disabled={!this.state.playerId} />

        <br />
        <br />
        <Link to={t.route('forgotPassword')} className="pull-right" style={{marginTop: 20, marginRight: 10, fontSize: 18}}>
          {t('password.forgotLink')}
        </Link>
      </Paper>
    );
  }
}
