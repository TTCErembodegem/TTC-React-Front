import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { util as storeUtils } from '../../../store.js';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import UserModel from '../../../models/UserModel.js';
import MatchModel from '../../../models/MatchModel.js';
import * as matchActions from '../../../actions/matchActions.js';

import MatchScore from '../MatchScore.js';
import Icon from '../../controls/Icon.js';

@connect(state => {
  return {};
}, matchActions)
export default class MatchForm extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.instanceOf(UserModel).isRequired,
    match: PropTypes.instanceOf(MatchModel).isRequired,
    t: PropTypes.func.isRequired,
    updateScore: PropTypes.func.isRequired,
    big: PropTypes.bool,
  }

  render() {
    const match = this.props.match;
    const score = match.score || {home: 0, out: 0};
    const isEditable = match.scoreType === 'BeingPlayed' && this.props.user.canChangeMatchScore(match.id);

    return (
      <div style={{width: this.props.big ? 230 : 150}}>
        {isEditable ? <MatchManipulation big={this.props.big}
          style={{float: 'left', marginRight: 5}}
          plusClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home + 1, out: score.out})}
          minClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home - 1, out: score.out})} />
        : null}

        <div style={{display: 'inline'}}>
          <MatchScore match={match} forceDisplay={true} style={{fontSize: this.props.big ? 46 : 24}} />
        </div>

        {isEditable ? <MatchManipulation big={this.props.big}
          style={{float: 'right'}}
          plusClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home, out: score.out + 1})}
          minClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home, out: score.out - 1})} />
        : null}

      </div>
    );
  }

  _onUpdateScore(matchScore, e) {
    this.props.updateScore(matchScore);

    // TODO: bug updating the score opens/closes the tab...
    e.stopPropagation();
    e.preventDefault();
  }
}

const MatchManipulation = ({style, plusClick, minClick, big}) => (
  <div style={{color: '#d3d3d3', marginTop: big ? 0 : -10, ...style}}>
    <div style={{verticalAlign: 'top'}}><Icon fa="fa fa-plus-circle fa-2x" onClick={plusClick} /></div>
    <div style={{verticalAlign: 'bottom'}}><Icon fa="fa fa-minus-circle fa-2x" onClick={minClick} /></div>
  </div>
);