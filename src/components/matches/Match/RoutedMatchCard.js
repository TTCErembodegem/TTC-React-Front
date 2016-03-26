import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { util as storeUtils } from '../../../store.js';
import MatchCard from './MatchCard.js';
import withViewport from '../../../utils/decorators/withViewport.js';
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
      matchId: PropTypes.string.isRequired
    }),
    viewport: PropTypes.object.isRequired,
    fetchMatch: PropTypes.func.isRequired,
  }

  _setMatchId(props) {
    var matchId = parseInt(props.params.matchId, 10);
    this.state = {
      match: storeUtils.getMatch(matchId)
    };
    if (!this.state.match) {
      this.props.fetchMatch(this.props.params.matchId);
    }
  }

  componentWillReceiveProps(props) {
    this._setMatchId(props);
  }

  constructor(props) {
    super(props);
    this._setMatchId(props);
  }

  render() {
    if (!this.state.match) {
      return <FullScreenSpinner />;
    }
    return (
      <div style={{marginBottom: 20, marginTop: 20, marginLeft: 5, marginRight: 5}}>
        <MatchCard match={this.state.match} isOpen={true} width={this.props.viewport.width} />
      </div>
    );
  }
}