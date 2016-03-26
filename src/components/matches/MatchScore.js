import React, { PropTypes, Component } from 'react';
import MatchModel, { matchOutcome } from '../../models/MatchModel.js';
import { connect } from 'react-redux';
import { contextTypes } from '../../utils/decorators/withContext.js';
import cn from 'classnames';
import { setSetting } from '../../actions/configActions.js';

import Icon from '../controls/Icon.js';

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
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    match: PropTypes.instanceOf(MatchModel).isRequired,
    style: PropTypes.object,
    forceDisplay: PropTypes.bool.isRequired,
    setSetting: PropTypes.func.isRequired,
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
    var text = null;
    var title;
    var match = this.props.match;
    if (!this.props.forceDisplay) {
      if (!match.score || (match.score.home === 0 && match.score.out === 0)) {
        // HACK: remove the getPreviousMatch out of this component
        match = match.getPreviousMatch();
        if (!match) {
          return null;
        } else {
          text = <Icon fa="fa fa-long-arrow-left" style={{marginRight: 7}} />;
          title = this.context.t('match.previousEncounterScore');
        }
      }

      if (!match || !match.score || (match.score.home === 0 && match.score.out === 0)) {
        return null;
      }
    }

    var score = match.score || {home: 0, out: 0};
    const classColor = this.props.match.isDerby ? 'match-won' : getClassName(match.isHomeMatch, score.home, score.out);
    return (
      <span
        className={cn('label label-as-badge', classColor, this.state.isUpdated ? 'faa-tada animated' : '')}
        title={title}
        style={this.props.style}>

        {text}
        <span>{score.home + ' - ' + score.out}</span>
      </span>
    );
  }
}