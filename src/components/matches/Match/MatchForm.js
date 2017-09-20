import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import * as matchActions from '../../../actions/matchActions.js';

import MatchScore from '../MatchScore.js';
import {Icon} from '../../controls/Icon.js';

const scoreOrDefault = match => match.score || {home: 0, out: 0};

@connect(() => ({}), matchActions)
export default class MatchForm extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    user: PropTypes.UserModel.isRequired,
    match: PropTypes.MatchModel.isRequired,
    t: PropTypes.func.isRequired,
    updateScore: PropTypes.func.isRequired,
    big: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      useInput: false,
      inputScore: '',
      currentScore: scoreOrDefault(props.match)
    };
    this._onUpdateScoreDebounced = _.debounce(this._onUpdateScoreDebounced, 1000);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({currentScore: scoreOrDefault(nextProps.match)});
  }

  render() {
    const match = this.props.match;
    const score = this.state.currentScore;
    const isEditable = this.props.user.canChangeMatchScore(match);

    if (this.state.useInput) {
      return (
        <form>
        <div className="form-group">
          <input onChange={e => this.setState({inputScore: e.target.value})} placeholder="xx-xx" style={{width: 70, height: 30}} />
          <button type="button" className="btn btn-default" onClick={() => this._onInputScoreUpdate()} style={{marginLeft: 7}}>
            <Icon fa="fa fa-floppy-o" />
          </button>
        </div>
        </form>
      );
    }

    return (
      <div style={{width: this.props.big ? 280 : 175}}>
        {isEditable ? <MatchManipulation big={this.props.big}
          style={{float: 'left', marginRight: 5}}
          plusClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home + 1, out: score.out})}
          minClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home - 1, out: score.out})} />
        : null}

        <div style={{display: 'inline'}} onClick={() => this.setState({useInput: !this.state.useInput})}>
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

  _onInputScoreUpdate() {
    const newScores = this.state.inputScore.split('-');
    if (newScores.length === 2) {
      const [home, out] = newScores.map(n => parseInt(n.trim(), 10));
      this.props.updateScore({matchId: this.props.match.id, home, out});
    }
    this.setState({useInput: false});
  }

  _onUpdateScore(matchScore, e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({currentScore: matchScore});
    this._onUpdateScoreDebounced(matchScore);
  }
  _onUpdateScoreDebounced(matchScore) {
    this.props.updateScore(matchScore).then(() => this.setState({currentScore: scoreOrDefault(this.props.match)}));
  }
}

const MatchManipulation = ({style, plusClick, minClick, big}) => (
  <div style={{color: '#d3d3d3', marginTop: big ? 0 : -10, ...style}}>
    <div style={{verticalAlign: 'top'}}><Icon fa="fa fa-plus-circle fa-2x" onClick={plusClick} /></div>
    <div style={{verticalAlign: 'bottom'}}><Icon fa="fa fa-minus-circle fa-2x" onClick={minClick} /></div>
  </div>
);