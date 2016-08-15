import React, { Component } from 'react';
import PropTypes, { connect, withViewport } from '../PropTypes.js';
import _ from 'lodash';
import { util as storeUtil } from '../../store.js';

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
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.object.isRequired,
    user: PropTypes.UserModel.isRequired,
    players: PropTypes.PlayerModelList.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    setSetting: PropTypes.func.isRequired,
    viewport: PropTypes.viewport,
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

    if (this.props.viewport.width > 1500) {
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
          <div className="col-lg-6" style={{paddingBottom: 5, paddingTop: 5}} key={match.id}>
            <MatchCard
              match={match}
              user={this.props.user}
              isOpen={false}
              width={this.props.viewport.width}
              viewportWidthContainerCount={this.props.viewport.width > 1200 ? 2 : 1}
              config={this.props.config} />
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