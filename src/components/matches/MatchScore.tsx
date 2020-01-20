import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import cn from 'classnames';
import PropTypes, {connect, withViewport} from '../PropTypes';
import {setSetting} from '../../actions/configActions';
import {Icon} from '../controls/Icons/Icon';
import {TrophyIcon} from '../controls/Icons/TrophyIcon';
import {CommentIcon} from '../controls/Icons/CommentIcon';

function getClassName(isHomeMatch, home, out) {
  if (home === out) {
    return 'match-draw';
  }
  let won = home > out;
  if (!isHomeMatch) {
    won = !won;
  }
  return won ? 'match-won' : 'match-lost';
}

class MatchScore extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    config: PropTypes.object.isRequired,
    setSetting: PropTypes.func.isRequired,
    viewport: PropTypes.viewport,

    match: PropTypes.MatchModel.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    forceDisplay: PropTypes.bool.isRequired,
    showComments: PropTypes.bool,
    showThrophy: PropTypes.bool,
  }

  static defaultProps = {
    forceDisplay: false,
    showThrophy: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      isUpdated: props.config.get(`newMatchScore${props.match.id}`),
    };
  }

  componentWillReceiveProps(newProps) {
    const hasScoreUpdate = newProps.config.get(`newMatchScore${newProps.match.id}`);
    if (hasScoreUpdate) {
      this.setState({isUpdated: true});
      setTimeout(() => {
        this.setState({isUpdated: false});
        this.props.setSetting(`newMatchScore${newProps.match.id}`, false);
      }, 10000);
    }
  }

  render() {
    let {match} = this.props;
    if (!this.props.forceDisplay) {
      if (!match.score || (match.score.home === 0 && match.score.out === 0)) {
        // HACK: remove the getPreviousMatch out of this component
        match = match.getPreviousMatch();
        if (!match || !match.score || (match.score.home === 0 && match.score.out === 0)) {
          return null;
        }
        const classColor2 = this.props.match.isDerby ? 'match-won' : getClassName(match.isHomeMatch, match.score.home, match.score.out);
        return (
          <Link to={this.context.t.route('match', {matchId: match.id})}>
            <span
              className={cn('label label-as-badge clickable', classColor2, this.props.className)}
              title={this.context.t('match.previousEncounterScore')}
              style={this.props.style}
            >

              <Icon fa="fa fa-long-arrow-left" style={{marginRight: 7}} />
              <span>{match.renderScore()}</span>
            </span>
          </Link>
        );

      }
    }

    const score = match.score || {home: 0, out: 0};
    const classColor = match.isDerby ? 'match-won' : getClassName(match.isHomeMatch, score.home, score.out);
    return (
      <span
        className={cn('label label-as-badge clickable', this.props.className, classColor, {'faa-tada animated': this.state.isUpdated})}
        style={this.props.style}
      >

        <span>
          {classColor === 'match-won' && !match.isDerby && this.props.viewport.width > 350 && this.props.showThrophy ? (
            <TrophyIcon style={{marginRight: 7, marginTop: 4, fontWeight: 'normal'}} color="#FFE568" />
          ) : null}
          {`${score.home} - ${score.out}`}
          {this.props.showComments && (match.comments.size || match.description) ? (
            <CommentIcon style={{marginLeft: 8}} translate tooltip="match.scoreComment" />
          ) : null}
        </span>
      </span>
    );
  }
}

export default withViewport(connect(state => ({config: state.config}), {setSetting})(MatchScore));
