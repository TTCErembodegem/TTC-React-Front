import React, { PropTypes, Component } from 'react';
import { MatchReport as MatchReportModel, matchOutcome } from '../../../models/Match.js';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import cn from 'classnames';

function getClassName(scoreType) {
  switch (scoreType) {
  case matchOutcome.Won:
    return 'label-info';
  case matchOutcome.Draw:
    return 'label-default';
  }
  return 'label-warning';
}

export default class MatchScore extends Component {
  static contextTypes = contextTypes;

  static propTypes = {
    report: PropTypes.instanceOf(MatchReportModel).isRequired
  }

  render() {
    var report = this.props.report;
    if (!report.isPlayed) {
      return null;
    }

    return (<span className={cn('label label-as-badge', getClassName(report.scoreType))}>{report.getScore()}</span>);
  }
}