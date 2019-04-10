import React, {Component} from 'react';
import PropTypes, {connect, storeUtil} from '../../PropTypes.js';
import {PlayerLink} from '../../controls.js';

export default class NextSeasonChanges extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    calcer: PropTypes.object,
  }

  render() {
    const calcer = this.props.calcer;
    return (
      <div>
        <h2>Volgend Seizoen</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>Vttl</h3>
            <NextSeasonRankingChanges rankings={calcer.getNewRanking('Vttl')} />
          </div>
          <div className="col-md-6">
            <h3>Sporta</h3>
            <NextSeasonRankingChanges rankings={calcer.getNewRanking('Sporta')} />
          </div>
        </div>
      </div>
    );
  }
}


const NextSeasonRankingChanges = ({rankings}) => {
  if (!rankings.length) {
    return null;
  }

  return (
    <div className="row">
      <h4>Klassementwijzigingen</h4>
      {rankings.map(ranking => {
        return (
          <div key={ranking.ply.id} className="col-sm-6">
            <PlayerLink player={ranking.ply} style={{marginRight: 12}} />
            {ranking.old}
            <i className="fa fa-long-arrow-right" style={{marginLeft: 8, marginRight: 8}} />
            {ranking.new}
          </div>
        );
      })}
    </div>
  );
};
