import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes, {browseTo} from '../../PropTypes.js';
import storeUtil from '../../../storeUtil.js';
import {DivisionRankingLabel} from '../../matches/controls/DivisionRankingLabel.js';
import {OwnClubId} from '../../../models/ClubModel.js';

export class OpponentLink extends Component {
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
    withPosition: PropTypes.bool,
  }

  static defaultProps = {withPosition: true};

  render() {
    const {withPosition, team, opponent} = this.props;
    let teamTitle = `${storeUtil.getClub(opponent.clubId).name} ${opponent.teamCode}`;

    if (opponent.clubId !== OwnClubId && browseTo.getOpponent(team.competition, opponent) !== document.location.pathname) {
      teamTitle = (
        <Link className="link-hover-underline" to={browseTo.getOpponent(team.competition, opponent)}>
          {teamTitle}
        </Link>
      );
    }

    const divisionRanking = team.getDivisionRanking(opponent);
    if (divisionRanking.isForfait) {
      return <s>{teamTitle}</s>;
    }

    return (
      <span>
        {withPosition ? <DivisionRankingLabel divisionRanking={divisionRanking} /> : null}
        {teamTitle}
      </span>
    );
  }
}
