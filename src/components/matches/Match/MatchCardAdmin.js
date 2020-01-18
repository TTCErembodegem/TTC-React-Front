import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes.js';
import {forceFrenoySync} from '../../../actions/matchActions.js';

class MatchCardAdminComponent extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    forceFrenoySync: PropTypes.func.isRequired,
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    const {match} = this.props;
    return (
      <div style={{padding: 7}}>
        <button onClick={() => this.props.forceFrenoySync(match.id)} className="btn btn-default pull-right">
          Nu synchroniseren
        </button>

        ID={match.id}<br />FrenoyId={match.frenoyMatchId}

        <div style={{clear: 'both'}} />

        <pre>
          {JSON.stringify(match, null, 4)}
        </pre>
      </div>
    );
  }
}

export const MatchCardAdmin = connect(null, {forceFrenoySync})(MatchCardAdminComponent);
