import React, {Component} from 'react';
import PropTypes, {withViewport, storeUtil} from '../../PropTypes.js';
import {getRankingValue} from '../../../models/utils/playerRankingValueMapper.js';

import {ThumbsDownIcon, FrenoyLink, Spinner, ThumbsUpIcon} from '../../controls.js';
import Table from 'react-bootstrap/lib/Table';
import {MatchPlayerRankings, getMatchPlayerRankings} from '../controls/MatchPlayerRankings.js';

@withViewport
export class OpponentsTeamFormation extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    viewport: PropTypes.viewport,
    matches: PropTypes.MatchModelList.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
  }

  render() {
    const {matches, opponent} = this.props;

    const createKey = form => form.reduce((key, f) => key + f.amount + f.ranking, '');

    const formations = matches.filter(match => match.isSyncedWithFrenoy).reduce((acc, match) => {
      const formation = getMatchPlayerRankings(match, opponent);
      console.log('form1', match.date.format(), formation);

      const exists = acc.find(form => form.key === createKey(formation));
      if (!exists) {
        acc.push({
          key: createKey(formation),
          details: formation,
          amount: 1,
          value: 0,
        });
        //getRankingValue(match.competition, )

      } else {
        console.log('exists', exists);
        exists.amount++;
      }
      return acc;
    }, []);

    console.log('form', formations);

    // if (formations.length === 0) {
    //   return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
    // }


    return (
      <div>

      </div>
    );
  }
}
