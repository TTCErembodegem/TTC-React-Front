import React, {Component} from 'react';
import PropTypes, {connect} from '../PropTypes';
import {forceFrenoySync} from '../../actions/matchActions';

class AdminMatchesComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    matches: PropTypes.MatchModelList.isRequired,
    forceFrenoySync: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {matchId: null};
  }

  render() {
    return (
      <div style={{paddingLeft: 15}}>
        <h1>Force Frenoy Sync</h1>
        MatchId:
        <input type="text" onChange={e => this.setState({matchId: e.target.value})} style={{marginRight: 7, height: 32}} />
        <button onClick={() => this.props.forceFrenoySync(this.state.matchId)} className="btn btn-default">
          Force Sync
        </button>
      </div>
    );
  }
}

export const AdminMatches = connect(state => ({matches: state.matches}), {forceFrenoySync})(AdminMatchesComponent);
