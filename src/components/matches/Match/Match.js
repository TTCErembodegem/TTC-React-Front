import React, { PropTypes, Component } from 'react';
import MatchModel from '../../../models/Match.js';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Match.css';

import Badge from 'material-ui/lib/badge';
import Icon from '../../controls/Icon';

@withStyles(styles)
export default class Match extends Component {
  static contextTypes = contextTypes;

  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired
  }

  _formatMatchDate() {
    var match = this.props.match;
    if (match.date.minutes()) {
      return match.date.format('D/M HH:mm');
    }
    return match.date.format('D/M HH');
  }

  render() {
    var match = this.props.match;

    var score;
    if (match.score) {
      score = (
        <Badge badgeContent={match.score} secondary badgeStyle={{top: 12, right: 6}}/>
      );
    }

    return (
      <div className="match">
        <span>{this.context.t('match.date', this._formatMatchDate())}</span>
        <span>{this.context.t('match.vs', {home: match.getTeamDesc(), away: match.getOpponentDesc()})}</span>
        {score}
        <Icon fa="fa fa-caret-right" />
      </div>
    );
  }
}