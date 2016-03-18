import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { connect } from 'react-redux';
import { util as storeUtil } from '../../store.js';

import MatchModel from '../../models/MatchModel.js';
import PlayerModel from '../../models/PlayerModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';
import * as configActions from '../../actions/configActions.js';

import MatchCard from './Match/MatchCard.js';

@connect(state => {
  return {
    //config: state.config,
    user: state.user,
    players: state.players,
    //clubs: state.clubs,
    matches: state.matches,
    //teams: state.teams,
  };
}, configActions)
export default class MatchesToday extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    user: PropTypes.object.isRequired,
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    matches: ImmutablePropTypes.listOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    setSetting: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.setSetting('container100PerWidth', true);
  }
  componentWillUnmount() {
    this.props.setSetting('container100PerWidth', false);
  }

  render() {
    var matchesToday = storeUtil.matches.getTodayMatches();

    return (
      <div>
        {this._renderMatches(matchesToday.take(2))}
        {matchesToday.size > 2 ? this._renderMatches(matchesToday.skip(2)) : null}
      </div>
    );
  }

  _renderMatches(matches) {
    if (matches.size === 0) {
      return null;
    }

    return (
      <div className="row">
        {matches.map(match => (
          <div className="col-md-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
            <MatchCard match={match} user={this.props.user} isOpen={true} viewportWidthContainerCount={2} />
          </div>
        ))}
      </div>
    );
  }
}