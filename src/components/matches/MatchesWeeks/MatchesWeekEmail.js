import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import * as adminActions from '../../../actions/adminActions.js';
import Button from 'react-bootstrap/lib/Button';
import {EmailButton} from '../../controls.js';
import {WeekTitle} from './WeekTitle.js';
import {WeekCalcer} from './WeekCalcer.js';

@connect(state => ({user: state.user}), adminActions)
export class MatchesWeekEmail extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    emailFormation: PropTypes.func.isRequired,
    user: PropTypes.UserModel.isRequired,
    weekCalcer: PropTypes.instanceOf(WeekCalcer).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      mailFormOpen: false,
    };
  }

  render() {
    const t = this.context.t;

    if (!this.state.mailFormOpen) {
      return <EmailButton onClick={() => this.setState({mailFormOpen: !this.state.mailFormOpen})} />;
    }

    // TODO: need to launch an action that we want to take over the full screen :)

    return (
      <div>
        <h1>{t('week.emailTitle')}</h1>
        <WeekTitle weekCalcer={this.props.weekCalcer} />

        <Button bsStyle="danger" onClick={() => this.props.emailFormation()}>{t('week.sendEmail')}</Button>
        <Button onClick={() => this.setState({mailFormOpen: false})} style={{marginLeft: 6}}>{t('common.cancel')}</Button>
      </div>
    );
  }
}
