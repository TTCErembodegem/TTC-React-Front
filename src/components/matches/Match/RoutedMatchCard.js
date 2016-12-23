import React, { Component } from 'react';
import PropTypes, { connect, withViewport, storeUtil } from '../../PropTypes.js';
import MatchCard from './MatchCard.js';
import { fetchMatch } from '../../../actions/initialLoad.js';

import { FullScreenSpinner } from '../../controls/Spinner.js';

@withViewport
@connect(state => {
  return {
    matches: state.matches,
  };
}, {fetchMatch})
export default class RoutedMatchCard extends Component {
  static propTypes = {
    params: PropTypes.shape({
      matchId: PropTypes.string.isRequired,
      tabKey: PropTypes.string,
    }),
    viewport: PropTypes.viewport,
    fetchMatch: PropTypes.func.isRequired,
  }

  _getMatch(props) {
    const matchId = parseInt(props.params.matchId, 10);
    const match = storeUtil.getMatch(matchId);
    if (!match) {
      this.props.fetchMatch(this.props.params.matchId);
    }
    return match;
  }

  componentWillReceiveProps(props) {
    this.setState({match: this._getMatch(props)});
  }

  constructor(props) {
    super(props);
    this.state = {match: this._getMatch(props)};
  }

  render() {
    if (!this.state.match) {
      return <FullScreenSpinner />;
    }
    return (
      <div style={{marginBottom: 20, marginTop: 20, marginLeft: 5, marginRight: 5}}>
        <MatchCard match={this.state.match} isOpen={true} width={this.props.viewport.width} routed={true} params={this.props.params} />
      </div>
    );
  }
}