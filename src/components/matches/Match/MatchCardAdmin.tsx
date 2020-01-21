import React, {Component} from 'react';
import PropTypes, {connect} from '../../PropTypes';
import {forceFrenoySync} from '../../../actions/matchActions';
import {IMatch} from '../../../models/model-interfaces';

type MatchCardAdminComponentProps = {
  forceFrenoySync: Function;
  match: IMatch;
}

class MatchCardAdminComponent extends Component<MatchCardAdminComponentProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    const {match} = this.props;
    return (
      <div style={{padding: 7}}>
        <button type="button" onClick={() => this.props.forceFrenoySync(match.id)} className="btn btn-default pull-right">
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
