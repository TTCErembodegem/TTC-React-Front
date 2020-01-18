import React, {Component} from 'react';
import cn from 'classnames';
import PropTypes, {storeUtil} from '../../PropTypes';
import {OwnClubId} from '../../../models/ClubModel';
import {OpponentLink} from './OpponentLink';


export class TeamOverviewRanking extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    small: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {showAll: !props.small};
  }

  render() {
    const {team, small} = this.props;
    let {ranking} = team;

    if (ranking.length === 0) {
      return <div />;
    }

    if (small) {
      const ownTeamIndex = team.ranking.findIndex(r => r.clubId === OwnClubId);
      ranking = team.ranking.slice(Math.max(ownTeamIndex - 2, 0), ownTeamIndex + 3);
    }
    return (
      <div>
        <h3>{this.context.t('teamCalendar.view.ranking')}</h3>
        {ranking.map(teamRanking => {
          const isOwnClub = teamRanking.clubId === OwnClubId;
          const points = isOwnClub ? teamRanking.points : `(${teamRanking.points})`;
          return (
            <div
              key={teamRanking.clubId + teamRanking.teamCode}
              style={{marginRight: 15, display: 'inline-block', fontSize: isOwnClub ? 14 : undefined, fontWeight: isOwnClub ? 'bold' : undefined}}
              className={cn({'label label-as-badge label-info': isOwnClub && !small})}
            >
              {!isOwnClub ? (
                <OpponentLink team={team} opponent={{clubId: teamRanking.clubId, teamCode: teamRanking.teamCode}} />
              ) : (
                <span>
                  {teamRanking.position}.&nbsp;
                  {storeUtil.getClub(teamRanking.clubId).name} {teamRanking.teamCode}
                </span>
              )}
              &nbsp;
              <span style={{marginLeft: 7}}>{points}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
