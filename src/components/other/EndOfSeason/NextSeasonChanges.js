import React, {Component} from 'react';
import cn from 'classnames';
import PropTypes, {connect, storeUtil} from '../../PropTypes.js';
import {PlayerLink} from '../../controls.js';

export default class NextSeasonChanges extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    calcer: PropTypes.object,
  }

  render() {
    const {calcer} = this.props;
    return (
      <div>
        <h2>
          <i className="fa fa-line-chart" style={{marginRight: 15, color: 'gray'}} />
          Volgend Seizoen
          <i className="fa fa-line-chart" style={{marginLeft: 15, color: 'gray'}} />
        </h2>
        <div className="row next-season">
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

  const highest = rankings.reduce((acc, cur) => (acc.oldValue - acc.newValue > cur.oldValue - cur.newValue ? cur : acc), rankings[0]);
  return (
    <div className="row">
      {rankings.map(ranking => {
        const rankingDrop = ranking.oldValue > ranking.newValue ? 'ranking-drop' : null;
        const highestMounter = ranking.oldValue - ranking.newValue === highest.oldValue - highest.newValue;
        return (
          <div key={ranking.ply.id} className={cn('col-sm-6', rankingDrop, (highestMounter ? 'highest-mounter' : null))}>
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
