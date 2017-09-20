import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import * as adminActions from '../../../actions/adminActions.js';
import Button from 'react-bootstrap/lib/Button';

@connect(state => ({user: state.user}), adminActions)
export class MatchesWeekMail extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    emailFormation: PropTypes.func.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    user: PropTypes.UserModel.isRequired,
    onHide: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const t = this.context.t;

    return (
      <div>
        <h1>{t('week.emailTitle')}</h1>

        <Button bsStyle="danger" onClick={() => this.props.emailFormation()}>{t('week.sendEmail')}</Button>
        <Button onClick={this.props.onHide} style={{marginLeft: 6}}>{t('common.cancel')}</Button>
      </div>
    );
  }
}
