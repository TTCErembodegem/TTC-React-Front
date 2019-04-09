import React, {Component} from 'react';
import PropTypes, {connect, storeUtil, withStyles} from '../../PropTypes.js';
import Panel from 'react-bootstrap/lib/Panel';
import {Email, Telephone, PlayerAddress, PlayerLink} from '../../controls.js';
import PlayerImage from '../../players/PlayerImage.js';
import {AchievementsCalculator} from './AchievementsCalculator.js';

@connect(state => ({
  players: state.players,
  matches: state.matches,
  clubs: state.clubs,
}))
@withStyles(require('./achievements.css'))
export default class EndOfSeason extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    clubs: PropTypes.ClubModelList.isRequired,
  }

  render() {
    const matches = this.props.matches;
    const calcer = new AchievementsCalculator(this.props.players, matches);
    return (
      <div className="endofseason">
        <h3>Einde Seizoen 2018-2019</h3>
        <dl>
          {calcer.getAchievements().map((achievement, index) => <Achievement key={index} achievement={achievement} />)}
        </dl>

      </div>
    );
  }
}


const Achievement = ({achievement}) => {
  return [
    <dt key="1">
      {achievement.title ? <b>{achievement.title}&nbsp;</b> : null}
      <small> {achievement.desc}</small>
    </dt>,
    <dd key="2">
      <PlayerLink player={achievement.player} />

      {achievement.throphy}
    </dd>
  ];
};
