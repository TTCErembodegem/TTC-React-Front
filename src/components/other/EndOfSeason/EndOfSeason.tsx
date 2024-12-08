import React, {Component} from 'react';
import PropTypes, {connect, withContext} from '../../PropTypes';
import IntroClub from '../../App/IntroClub';
import IntroSponsors from '../../App/IntroSponsors';
import {Kampioenen} from './Kampioenen';
import Achievements from './Achievements';
import NextSeasonChanges from './NextSeasonChanges';
import {IPlayer, ITeam, IMatch, IClub} from '../../../models/model-interfaces';
import {AchievementsCalculator} from './AchievementsCalculator';
import {Strike} from '../../controls/controls/Strike';

// TODO: This thing crashes on PlayerLink --> Probably when there is someone in the achievements that has left the club

require('./achievements.css');

type EndOfSeasonProps = {
  players: IPlayer[];
  matches: IMatch[];
  clubs: IClub[];
  teams: ITeam[];
}

// eslint-disable-next-line react/prefer-stateless-function
class EndOfSeason extends Component<EndOfSeasonProps> {
  static contextTypes = PropTypes.contextTypes;

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
