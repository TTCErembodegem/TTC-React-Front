import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import PropTypes, {connect, storeUtil, withStyles, withContext} from '../../PropTypes';
import {Email, Telephone, PlayerAddress, PlayerLink, Strike} from '../../controls';
import PlayerImage from '../../players/PlayerImage';
import {AchievementsCalculator} from './AchievementsCalculator';
import IntroClub from '../../App/IntroClub';
import IntroSponsors from '../../App/IntroSponsors';
import {Kampioenen} from './Kampioenen';
import Achievements from './Achievements';
import NextSeasonChanges from './NextSeasonChanges';

require('./achievements.css');

class EndOfSeason extends Component {
  static contextTypes = PropTypes.contextTypes;

  static propTypes = {
    players: PropTypes.PlayerModelList.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    clubs: PropTypes.ClubModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
  }

  render() {
    const {matches} = this.props;
    const calcer = new AchievementsCalculator(this.props.players, matches, this.props.teams);
    return (
      <div className="endofseason-container">
        <div className="row">
          <div className="col-md-6">
            <IntroClub />
          </div>
          <div className="col-md-6">
            <h3>Komende Events</h3>
            <Strike text="Kampioenenhuldiging met drankje en hapje vrijdag 7 juni" />
            <Strike text="Save the date! Eetfestijn 2019 op zaterdag 28 september" />
          </div>
        </div>
        <h2>Einde Seizoen 2018-2019</h2>
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

export default withContext(connect(state => ({
  players: state.players,
  matches: state.matches,
  clubs: state.clubs,
  teams: state.teams,
}))(EndOfSeason));
