import React, {Component} from 'react';
import PropTypes from '../../PropTypes.js';
import {Badgy} from '../../controls.js';

export class TeamPosition extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    team: PropTypes.TeamModel.isRequired,
    opponent: PropTypes.shape({
      clubId: PropTypes.number.isRequired,
      teamCode: PropTypes.string,
    }),
    style: PropTypes.object,
  }
  static defaultProps = {
    style: {marginRight: 8, marginTop: -5}
  }

  render() {
    const {team, opponent} = this.props;
    const ranking = team.getDivisionRanking(opponent);
    if (ranking.empty) {
      return null;
    }

    var positionClassName;
    if (team.isTopper(opponent)) {
      positionClassName = 'match-won';
    } else if (team.isInDegradationZone(opponent)) {
      positionClassName = 'match-lost';
    } else {
      positionClassName = 'label-default';
    }

    return (
      <Badgy type={positionClassName} style={this.props.style} translate tooltip="teamCalendar.teamRanking">
        {ranking.position} / {team.ranking.length}
      </Badgy>
    );
  }
}
