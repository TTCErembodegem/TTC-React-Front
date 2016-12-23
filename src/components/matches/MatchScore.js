import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes, { connect } from '../PropTypes.js';
import cn from 'classnames';

import { setSetting } from '../../actions/configActions.js';
import Icon, { TrophyIcon } from '../controls/Icon.js';

function getClassName(isHomeMatch, home, out) {
  if (home === out) {
    return 'match-draw';
  }
  var won = home > out;
  if (!isHomeMatch) {
    won = !won;
  }
  return won ? 'match-won' : 'match-lost';
}

@connect(state => ({
  config: state.config
}), {setSetting})
export default class MatchScore extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    setSetting: PropTypes.func.isRequired,

    match: PropTypes.MatchModel.isRequired,
    style: PropTypes.object,
    forceDisplay: PropTypes.bool.isRequired,
    showComments: PropTypes.bool,
  }
  static defaultProps = {
    forceDisplay: false
  }

  constructor(props) {
    super(props);
    this.state = {
      isUpdated: props.config.get('newMatchScore' + props.match.id)
    };
  }

  componentWillReceiveProps(newProps) {
    const hasScoreUpdate = newProps.config.get('newMatchScore' + newProps.match.id);
    if (hasScoreUpdate) {
      this.setState({isUpdated: true});
      setTimeout(() => {
        this.setState({isUpdated: false});
        this.props.setSetting('newMatchScore' + newProps.match.id, false);
      }, 10000);
    }
  }

  render() {
    var match = this.props.match;
    if (!this.props.forceDisplay) {
      if (!match.score || (match.score.home === 0 && match.score.out === 0)) {
        // HACK: remove the getPreviousMatch out of this component
        match = match.getPreviousMatch();
        if (!match || !match.score || (match.score.home === 0 && match.score.out === 0)) {
          return null;
        } else {
          const classColor2 = this.props.match.isDerby ? 'match-won' : getClassName(match.isHomeMatch, match.score.home, match.score.out);
          return (
            <Link to={this.context.t.route('match', {matchId: match.id})}>
              <span
                className={cn('label label-as-badge', classColor2)}
                title={this.context.t('match.previousEncounterScore')}
                style={this.props.style}>

                <Icon fa="fa fa-long-arrow-left" style={{marginRight: 7}} />
                <span>{match.renderScore()}</span>
              </span>
            </Link>
          );
        }
      }
    }

    const score = match.score || {home: 0, out: 0};
    const classColor = match.isDerby ? 'match-won' : getClassName(match.isHomeMatch, score.home, score.out);
    return (
      <span
        className={cn('label label-as-badge', classColor, this.state.isUpdated ? 'faa-tada animated' : '')}
        style={this.props.style}>

        <span>
          {classColor === 'match-won' && !match.isDerby ? <TrophyIcon style={{marginRight: 7, marginTop: 4, fontWeight: 'normal'}} color="#FFE568" /> : null}
          {score.home + ' - ' + score.out}
          {this.props.showComments && (match.comments.size || match.description) ? <Icon fa="fa fa-comment-o" style={{marginLeft: 8}} /> : null}
        </span>
      </span>
    );
  }
}