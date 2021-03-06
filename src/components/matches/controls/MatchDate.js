import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes.js';

@withViewport
export class MatchDate extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    const t = this.context.t;
    const match = this.props.match;

    if (this.props.viewport.width > 768) {
      // Big
      if (match.isStandardStartTime()) {
        return <span>{t('match.date', match.getDisplayDate())}</span>;
      } else {
        return <span>{match.getDisplayDate('d')} <strong>{t('match.date', match.getDisplayTime())}</strong></span>;
      }
    }

    // Small
    if (match.isStandardStartTime()) {
      return <span>{match.getDisplayDate('s')}</span>;
    }
    return (
      <span>
        {match.getDisplayDate('s')}
        <br />
        {!match.isSyncedWithFrenoy ? <strong>{t('match.date', match.getDisplayTime())}</strong> : null}
      </span>
    );
  }
}
