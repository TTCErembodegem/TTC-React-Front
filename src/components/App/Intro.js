import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import moment from 'moment';

import withViewport from '../../utils/decorators/withViewport.js';
import withContext, { contextTypes } from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Strike from '../controls/Strike.js';
import MatchCardHeader from '../matches/Match/MatchCardHeader.js';
import Location from '../controls/Location.js';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Paper from 'material-ui/lib/paper';
import Typist from 'react-typist';

@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    matches: state.matches,
    teams: state.teams
  };
})
@withContext
@withViewport
@withStyles(styles)
export default class Intro extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: ImmutablePropTypes.map.isRequired,
    user: PropTypes.object,
    players: ImmutablePropTypes.list.isRequired,
    matches: ImmutablePropTypes.list.isRequired,
    teams: ImmutablePropTypes.list.isRequired,
    viewport: PropTypes.object.isRequired,
  };

  render() {
    const slagerijGuy = {
      description: 'Slagerij Guy',
      address: 'Erembodegem Dorp 72',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053211359',
    };

    const bakkerijVanLierde = {
      description: 'Brood & banket Van Lierde',
      address: 'Hogeweg 113',
      postalCode: 9320,
      city: 'Erembodegem',
      mobile: '053212720',
    };

    var inClub = {
      players: this.props.players.size,
      teamsSporta: this.props.teams.filter(t => t.competition === 'Sporta').size,
      teamsVttl: this.props.teams.filter(t => t.competition === 'Vttl').size,
    };

    const bottomSponsorsStyle = {
      padding: 5,
      textAlign: 'center',
      display: 'inline-block'
    };

    const showTopSponsors = this.props.viewport.width > 800;
    var topSponsors;
    if (showTopSponsors) {
      const topSponsorPaperStyle = {
        height: 100,
        width: 250,
        padding: 15,
        display: 'inline-block',
      };

      topSponsors = (
        <Row style={{marginTop: 10}}>
          <div style={{width: 460, margin: 'auto'}}>
            <Paper style={topSponsorPaperStyle}>
              <Location loc={bakkerijVanLierde} t={this.context.t} />
            </Paper>
            <Paper style={{...topSponsorPaperStyle, float: 'right', width: 200}}>
              <Location loc={slagerijGuy} t={this.context.t} />
            </Paper>
          </div>
        </Row>
      );
    }

    const topSponsorsOnBottomPaperStyle = {
      padding: 15,
      width: 220,
      margin: 'auto',
    };

    return (
      <div>
        <Strike text="vr. 13/05: Dubbeltoernooi" />
        <Strike text="vr. 20/05: Algemene vergadering & Kampioenenviering" />
        {topSponsors}
        <Row style={{marginTop: showTopSponsors ? 25 : undefined}}>
          <Col sm={6} style={{verticalAlign: 'top'}}>
            <h1>{this.context.t('intro.title')}</h1>
            {this.context.t('intro.text', inClub)}
          </Col>
          <Col sm={6}>
            {!this.props.config.get('initialLoadCompleted') ? <Loading t={this.context.t} bigScreen={this.props.viewport.width > 768} /> : <TodaysEvents {...this.props} />}
          </Col>
        </Row>
        {this.props.viewport.width > 800 ? (
          <Row style={{marginTop: 25, marginBottom: 15}}>
            <div style={{width: 770, margin: 'auto'}}>
              <Paper style={bottomSponsorsStyle}>
                <a href="http://www.tkleinoffer.be/" target="_blank"><img src="/img/sponsors/tkleinoffer.png" /></a>
              </Paper>
              <Paper style={{...bottomSponsorsStyle, marginLeft: 10}}>
                <a href="http://vdhkeukens.be/" target="_blank"><img src="/img/sponsors/vdhkeukens.png" /></a>
              </Paper>
              <Paper style={{...bottomSponsorsStyle, marginLeft: 10}}>
                <a href="http://www.doopsuikersymphony.be/" target="_blank"><img src="/img/sponsors/symphony.jpg" /></a>
              </Paper>
            </div>
          </Row>
        ) : null}
        {!showTopSponsors ? (
          <Row style={{margin: 10}}>
            <Strike text={this.context.t('intro.ourSponsors')} style={{marginBottom: 5}} />
            <Col>
              <Paper style={topSponsorsOnBottomPaperStyle}>
                <Location loc={bakkerijVanLierde} t={this.context.t} />
              </Paper>
            </Col>
            <Col style={{marginTop: 20}}>
              <Paper style={topSponsorsOnBottomPaperStyle}>
                <Location loc={slagerijGuy} t={this.context.t} />
              </Paper>
            </Col>
            <Col style={{marginTop: 20}}>
              <Paper style={topSponsorsOnBottomPaperStyle}>
                <a href="http://www.tkleinoffer.be/" target="_blank">
                  <img style= {{height: 100, width: 200}} src="/img/sponsors/tkleinoffer.png" />
                </a>
              </Paper>
            </Col>
            <Col style={{marginTop: 20}}>
              <Paper style={topSponsorsOnBottomPaperStyle}>
                <a href="http://vdhkeukens.be/" target="_blank">
                  <img style= {{height: 100, width: 200}} src="/img/sponsors/vdhkeukens.png" />
                </a>
              </Paper>
            </Col>
            <Col style={{marginTop: 20}}>
              <Paper style={topSponsorsOnBottomPaperStyle}>
                <a href="http://www.doopsuikersymphony.be/" target="_blank">
                  <img style= {{height: 100, width: 200}} src="/img/sponsors/symphony.jpg" />
                </a>
              </Paper>
            </Col>
          </Row>
        ) : null}
      </div>
    );
  }
}

// TODO: React warning: setState on unmounted component = Typist (loading schlager is gone too fast now...)

const Loading = ({t, bigScreen}) => (
  <div style={bigScreen ? undefined : {width: 310, margin: 'auto', marginBottom: 15, marginTop: 15}}>
    <img
      src="/img/schlager.gif"
      style={{borderRadius: 25}}
      title={t('intro.loading')} />

    <div style={{position: 'absolute', top: 5, width: 310, margin: 'auto'}}>
      <div style={{width: 310, textAlign: 'center', color: 'white'}}>
        <Typist cursor={{show: false}} startDelay={0}>{t('intro.loading')}</Typist>
      </div>
    </div>
  </div>
);


class TodaysEvents extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: ImmutablePropTypes.map.isRequired,
    user: PropTypes.object,
    players: ImmutablePropTypes.list.isRequired,
    matches: ImmutablePropTypes.list.isRequired,
    teams: ImmutablePropTypes.list.isRequired,
  };

  render() {
    const t = this.context.t;

    const today = moment();
    const matchesToday = this.props.matches.filter(cal => cal.date.isSame(today, 'day'));
    if (matchesToday.size) {
      return (
        <div>
          <Strike text={t('intro.matchesToday')} />
          {this._renderMatches(matchesToday)}
        </div>
      );
    }

    // TODO: training weekdays & hour hardcoded (+ duplicated in footer)
    var trainingEvent;
    if (today.weekday() === 1 || today.weekday() === 3) {
      trainingEvent = <Strike text={t('intro.trainingToday')} />;
    }

    const lastPlayedMatches = this.props.matches
      .filter(cal => cal.date.isBefore(today, 'day'))
      .sort((a, b) => b.date - a.date)
      .take(2);

    return (
      <div>
        {trainingEvent}
        <Strike text={t('intro.playedMatches')} />
        {this._renderMatches(lastPlayedMatches)}
      </div>
    );
  }

  _renderMatches(matches) {
    return (
      <div>
        {matches.map(match => (
          <div style={{padding: 5}} key={match.id}>
            <MatchCardHeader match={match} user={this.props.user} isOpen={false} config={this.props.config} noScoreEdit />
          </div>
        ))}
      </div>
    );
  }
}