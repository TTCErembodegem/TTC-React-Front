import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import * as adminActions from '../../../actions/adminActions.js';
import Button from 'react-bootstrap/lib/Button';
import {Modal} from 'react-bootstrap';
import {EmailButton} from '../../controls.js';
import {WeekTitle} from './WeekTitle.js';
import {WeekCalcer} from './WeekCalcer.js';
import {Editor} from '../../controls/Editor';
import {buildHtml} from './htmlBuilder';
import {getOpponentMatches} from '../../../actions/matchActions';

@connect(state => ({user: state.user, players: state.players}), {getOpponentMatches, ...adminActions})
/** EmailButton that turns into a MatchWeekEmailComposeComponent (Modal) */
export class MatchesWeekEmail extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    emailFormation: PropTypes.func.isRequired,
    user: PropTypes.UserModel.isRequired,
    weekCalcer: PropTypes.instanceOf(WeekCalcer).isRequired,
    matches: PropTypes.any.isRequired,
    prevMatches: PropTypes.any.isRequired,
    compFilter: PropTypes.oneOf(['Vttl', 'Sporta']),
    getOpponentMatches: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      mailFormOpen: false,
      email: '',
    };
  }

  componentDidMount() {
    const allMatches = this.props.matches.concat(this.props.prevMatches);
    allMatches.forEach(match => {
      this.props.getOpponentMatches(match.teamId, match.opponent);
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.matches !== this.props.matches) {
      this.componentDidMount();
    }
  }

  render() {
    const t = this.context.t;

    if (!this.state.mailFormOpen) {
      const user = this.props.players.find(p => p.id === this.props.user.playerId);
      return (
        <EmailButton
          onClick={() => this.setState({
            mailFormOpen: !this.state.mailFormOpen,
            email: buildHtml(user, this.props.compFilter, this.props.matches, this.props.prevMatches)
          })}
          tooltip={t('week.emailTitle')}
        />
      );
    }

    const editorOptions = {
      buttonLabels: 'fontawesome',
      placeholder: {
        text: ''
      },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'h2', 'h3', 'anchor']
      }
    };

    // TODO: marginTop: 50
    return (
      <Modal.Dialog style={{}}>
        <Modal.Header>
          <Modal.Title>{this.props.compFilter} {t('week.emailTitle')}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <WeekTitle weekCalcer={this.props.weekCalcer} style={{marginTop: 0}} />
          <Editor
            tag="pre"
            text={this.state.email}
            style={{height: 300, marginRight: 15}}
            onChange={value => this.setState({email: value})}
            options={editorOptions}
            contentEditable={true}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => this.setState({mailFormOpen: false})} style={{marginLeft: 6}}>{t('common.cancel')}</Button>
          <Button bsStyle="danger" onClick={() => this.props.emailFormation()}>{t('week.sendEmail')}</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
