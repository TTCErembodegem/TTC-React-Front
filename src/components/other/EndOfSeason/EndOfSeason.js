import React, {Component} from 'react';
import PropTypes, {connect, storeUtil, withStyles, withContext} from '../../PropTypes.js';
import Panel from 'react-bootstrap/lib/Panel';
import {Email, Telephone, PlayerAddress, PlayerLink, Strike} from '../../controls.js';
import PlayerImage from '../../players/PlayerImage.js';
import {AchievementsCalculator} from './AchievementsCalculator.js';
import IntroClub from '../../App/IntroClub.js';
import IntroSponsors from '../../App/IntroSponsors.js';
import {Kampioenen} from './Kampioenen.js';
import Achievements from './Achievements.js';
import NextSeasonChanges from './NextSeasonChanges.js';


@connect(state => ({
  players: state.players,
  matches: state.matches,
  clubs: state.clubs,
  teams: state.teams,
}))
@withStyles(require('./achievements.css'))
@withContext
export default class EndOfSeason extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    clubs: PropTypes.ClubModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
  }

  render() {
    const matches = this.props.matches;
    const calcer = new AchievementsCalculator(this.props.players, matches, this.props.teams);
    return (
      <div className="endofseason-container">
        <div className="row">
          <div className="col-md-6">
            <IntroClub />
          </div>
        </div>
        <h2>Einde Seizoen {new Date().getFullYear()-1}-{new Date().getFullYear()}</h2>
        <Kampioenen topTeams={calcer.getTopRankedTeams()} t={this.context.t} />
        <NextSeasonChanges calcer={calcer} />
        <Achievements calcer={calcer} />
        <div className="row">
          <IntroSponsors />
        </div>
      </div>
    );
  }
}
