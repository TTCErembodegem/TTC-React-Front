import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import withContext, { contextTypes } from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Matches from '../matches/Matches.js';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Paper from 'material-ui/lib/paper';

import Location from '../controls/Location.js';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    // clubs: state.clubs,
    // matches: state.matches,
    teams: state.teams
  };
})
@withContext
@withStyles(styles)
export default class App extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: ImmutablePropTypes.map.isRequired,
    user: PropTypes.object,
    players: ImmutablePropTypes.list.isRequired,
    teams: ImmutablePropTypes.list.isRequired,
  };

  render() {
    const slagerijGuy = {
      description: 'Slagerij Guy',
      address: 'Erembodegem Dorp 72',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053 / 21 13 59',
    };

    const bakkerijVanLierde = {
      description: 'Brood & banket Van Lierde',
      address: 'Hogeweg 113',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053 / 21 27 20',
    };

    const paperStyle = {
      height: 120,
      width: 240,
      padding: 25,
      display: 'inline-block',
    };

    // TODO: op heenronde score klikken: naar match gaan

    // TODO: matchen vandaag
    // Trainingsdag vermelden indien zo

    // Niet ingelogd:
    // Match cards tonen indien matchen vandaag
    // Zoniet, Bestuur tonen? Of extra goto knoppen? (kalender, ...?)
    // Wel ingelogd:
    // Match cards tonen jouw volgende matchen

    var inClub = {
      players: this.props.players.size,
      teams: this.props.teams.size,
      teamsSporta: this.props.teams.filter(t => t.competition === 'Sporta').size,
      teamsVttl: this.props.teams.filter(t => t.competition === 'Vttl').size,
    };

    return (
      <div>
        <Row>
          <Col xsHidden xs={3} />
          <Col xs={1}>
            <Paper style={paperStyle}>
              <Location loc={bakkerijVanLierde} t={this.context.t} />
            </Paper>
          </Col>
          <Col xs={1} xsOffset={3}>
            <Paper style={paperStyle}>
              <Location loc={slagerijGuy} t={this.context.t} />
            </Paper>
          </Col>
        </Row>
        <Row style={{marginTop: 25}}>
          <Col md={3}>
            {this.props.config.get('initialLoadCompleted') ? <Loading /> : null}
          </Col>
          <Col md={6}>
            <h1>Tafeltennisclub TTC Erembodegem</h1>
            Een kleine, toffe club met {inClub.players} leden.
            Ondanks onze beperkte kern, slagen we er toch in om
             met {inClub.teamsVttl} ploegen VTTL en {inClub.teamsSporta} Sporta
             in competitie te treden. Fairplay en gezelligheid staan centraal bij al onze
            tafeltennis-activiteiten!

            {this.props.config.get('initialLoadCompleted') ? null : null}
          </Col>
        </Row>
        <Row>
          nog meer sponsers
        </Row>
      </div>
    );
  }
}

const Loading = () => (
  <div>
    <img src="/img/schlager.gif" style={{border: '1px solid white', borderRadius: 25, marginLeft: -50}} />
  </div>
);