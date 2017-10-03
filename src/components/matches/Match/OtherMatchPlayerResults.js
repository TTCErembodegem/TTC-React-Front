import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import OpponentPlayer from './OpponentPlayer.js';

export class OtherMatchPlayerResults extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    match: PropTypes.MatchModel.isRequired,
  }

  render() {
    const match = this.props.match;
    return (
      <tr key={match.id + '_details'}>
        <td colSpan={5}>
          <h4 style={{marginTop: 5}}>{match.getClub('home').name} {match.home.teamCode}</h4>
          {match.getOwnPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={this.context.t} competition={match.competition} />)}

          <h4>{match.getClub('away').name} {match.away.teamCode}</h4>
          {match.getTheirPlayers().map(ply => <OpponentPlayer ply={ply} key={ply.position} t={this.context.t} competition={match.competition} />)}
        </td>
      </tr>
    );
  }
}
