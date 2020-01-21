import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes, {connect} from '../../PropTypes';
import * as matchActions from '../../../actions/matchActions';
import MatchScore from '../MatchScore';
import {Icon} from '../../controls/Icons/Icon';
import {IUser} from '../../../models/UserModel';
import {IMatch, Translator, IMatchScore} from '../../../models/model-interfaces';

const scoreOrDefault = (match: IMatch): IMatchScore => match.score || {home: 0, out: 0};

type MatchFormProps = {
  user: IUser;
  match: IMatch;
  t: Translator;
  updateScore: Function;
  big?: boolean;
}

type MatchFormState = {
  useInput: boolean;
  inputScore: string;
  currentScore: IMatchScore;
}

class MatchForm extends Component<MatchFormProps, MatchFormState> {
  static contextTypes = PropTypes.contextTypes;

  constructor(props) {
    super(props);
    this.state = {
      useInput: false,
      inputScore: '',
      currentScore: scoreOrDefault(props.match),
    };
    this._onUpdateScoreDebounced = _.debounce(this._onUpdateScoreDebounced, 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({currentScore: scoreOrDefault(nextProps.match)});
  }

  render() {
    const {match} = this.props;
    const score = this.state.currentScore;
    const isEditable = this.props.user.canChangeMatchScore(match);

    if (this.state.useInput) {
      return (
        <form>
          <div className="form-group">
            <input onChange={e => this.setState({inputScore: e.target.value})} placeholder="xx-xx" style={{width: 70, height: 30}} />
            <button type="button" className="btn btn-default" onClick={e => this._onInputScoreUpdate(e)} style={{marginLeft: 7}}>
              <Icon fa="fa fa-floppy-o" />
            </button>
          </div>
        </form>
      );
    }

    return (
      <div style={{width: this.props.big ? 280 : 175}}>
        {isEditable ? (
          <MatchManipulation
            isHome
            big={this.props.big}
            style={{float: 'left', marginRight: 5}}
            plusClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home + 1, out: score.out})}
            minClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home - 1, out: score.out})}
          />
        ) : null}

        <div style={{display: 'inline'}} onClick={e => this._onOpenInputScore(e)} role="button" tabIndex={0}>
          <MatchScore match={match} forceDisplay style={{fontSize: this.props.big ? 46 : 24}} showThrophy={false} />
        </div>

        {isEditable ? (
          <MatchManipulation
            big={this.props.big}
            style={{float: 'right'}}
            plusClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home, out: score.out + 1})}
            minClick={this._onUpdateScore.bind(this, {matchId: match.id, home: score.home, out: score.out - 1})}
          />
        ) : null}

      </div>
    );
  }

  _onOpenInputScore(e) {
    e.stopPropagation();
    this.setState(prevState => ({useInput: !prevState.useInput}));
  }

  _onInputScoreUpdate(e) {
    e.stopPropagation();
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


type MatchManipulationProps = {
  style?: React.CSSProperties;
  plusClick: Function;
  minClick: Function;
  big?: boolean;
  isHome?: boolean;
};

const MatchManipulation = ({style, plusClick, minClick, big, isHome}: MatchManipulationProps) => (
  <div style={{color: '#d3d3d3', marginTop: big ? 0 : -10, ...style}}>
    <div style={{verticalAlign: 'top'}}>
      <Icon
        fa="fa fa-plus-circle fa-2x"
        onClick={plusClick}
        translate
        tooltip={isHome ? 'match.scoreHomeUp' : 'match.scoreOutUp'}
        tooltipPlacement="left"
      />
    </div>
    <div style={{verticalAlign: 'bottom'}}>
      <Icon
        fa="fa fa-minus-circle fa-2x"
        onClick={minClick}
        translate
        tooltip={isHome ? 'match.scoreHomeDown' : 'match.scoreOutDown'}
        tooltipPlacement="bottom"
      />
    </div>
  </div>
);

export default connect(() => ({}), matchActions)(MatchForm);
