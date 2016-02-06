import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Match.css';

import Badge from 'material-ui/lib/badge';
import Icon from '../../controls/Icon';

@withStyles(styles)
export default class Match extends Component {
  static contextTypes = contextTypes;

  _formatMatchDate() {
    if (this.props.date.minutes()) {
      return this.props.date.format('D/M HH:mm');
    }
    return this.props.date.format('D/M HH');
  }

  render() {
    var score;
    if (this.props.score) {
      score = (
        <Badge badgeContent={this.props.score} secondary badgeStyle={{top: 12, right: 6}}/>
      );
    }

    return (
      <div className="match">
        <span>{this.context.t('match.date', this._formatMatchDate())}</span>
        <span>{this.context.t('match.vs', {home: this.props.getTeamDesc(), away: this.props.getOpponentDesc()})}</span>
        {score}
        <Icon fa="fa fa-caret-right" />
      </div>
    );
  }
}