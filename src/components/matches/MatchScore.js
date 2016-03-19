import React, { PropTypes, Component } from 'react';
import MatchModel, { matchOutcome } from '../../models/MatchModel.js';

import { contextTypes } from '../../utils/decorators/withContext.js';
import cn from 'classnames';

import Icon from '../controls/Icon.js';

function getClassName(scoreType) {
  switch (scoreType) {
  case matchOutcome.Won:
    return 'match-won';
  case matchOutcome.Draw:
    return 'match-draw';
  }
  return 'match-lost';
}

export default class MatchScore extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    style: PropTypes.object,
    forceDisplay: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    forceDisplay: false
  }

  render() {
    var text = null;
    var title;
    var match = this.props.match;
    if (!this.props.forceDisplay) {
      if (!match.score || (match.score.home === 0 && match.score.out === 0)) {
        match = match.getPreviousMatch();
        if (!match) {
          return null;
        } else {
          text = <Icon fa="fa fa-long-arrow-left" style={{marginRight: 7}} />;
          title = this.context.t('match.previousEncounterScore');
        }
      }

      if (!match || !match.score) {
        return null;
      }
    }

    const classColor = this.props.match.isDerby ? getClassName(matchOutcome.Won) : getClassName(match.scoreType);
    return (
      <span
        className={cn('label label-as-badge', classColor)}
        title={title}
        style={this.props.style}>

        {text}
        {match.score ? (match.score.home + ' - ' + match.score.out) : '0 - 0'}
      </span>
    );
  }
}