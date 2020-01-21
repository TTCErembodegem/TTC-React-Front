import React, {Component} from 'react';
import PropTypes, {withViewport} from '../../PropTypes';
import {IMatch, Viewport} from '../../../models/model-interfaces';

type MatchDateComponentProps = {
  viewport: Viewport;
  match: IMatch;
}

export class MatchDateComponent extends Component<MatchDateComponentProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    const {t} = this.context;
    const {match} = this.props;

    if (this.props.viewport.width > 768) {
      // Big
      if (match.isStandardStartTime()) {
        return <span>{t('match.date', match.getDisplayDate())}</span>;
      }
      return <span>{match.getDisplayDate('d')} <strong>{t('match.date', match.getDisplayTime())}</strong></span>;

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

export const MatchDate = withViewport(MatchDateComponent);
