import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import _ from 'lodash';
import { connect } from 'react-redux';
import { util as storeUtil } from '../../store.js';
import withViewport from '../../utils/decorators/withViewport.js';

import MatchModel from '../../models/MatchModel.js';
import PlayerModel from '../../models/PlayerModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';
import * as configActions from '../../actions/configActions.js';

import MatchCard from './Match/MatchCard.js';

@withViewport
@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    matches: state.matches,
  };
}, configActions)
export default class MatchesToday extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    players: ImmutablePropTypes.listOf(PropTypes.instanceOf(PlayerModel).isRequired).isRequired,
    matches: ImmutablePropTypes.listOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    setSetting: PropTypes.func.isRequired,
    viewport: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.setSetting('container100PerWidth', true);
  }
  componentWillUnmount() {
    this.props.setSetting('container100PerWidth', false);
  }

  render() {
    var matchesToday = storeUtil.matches.getTodayMatches();
    if (matchesToday.size === 0) {
      return <div />;
    }

    if (this.props.viewport.width > 1200) {
      return (
        <div>
          {this._renderBigMatches(_.take(matchesToday.toArray(), 2))}
          {matchesToday.size > 2 ? this._renderBigMatches(matchesToday.shift().shift()) : null}
        </div>
      );
    }

    // on small devices
    // onOpen={null} == default behavior == open match card
    return (
      <div className="row">
        {matchesToday.map(match => (
          <div className="col-lg-12" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
            <MatchCard match={match} user={this.props.user} isOpen={false} width={this.props.viewport.width} config={this.props.config} onOpen={null} />
          </div>
        ))}
      </div>
    );
  }

  _renderBigMatches(matches) {
    return (
      <div className="row">
        {matches.map(match => (
          <div className="col-md-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
            <MatchCard match={match} user={this.props.user} isOpen={true} viewportWidthContainerCount={2} big config={this.props.config} />
          </div>
        ))}
      </div>
    );
  }
}