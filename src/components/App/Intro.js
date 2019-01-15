import React, {Component} from 'react';
import PropTypes, {connect, withViewport, withContext, withStyles} from '../PropTypes.js';
import moment from 'moment';
import ClubLocationInstructions from '../other/ClubLocationInstructions.js';

import {Strike} from '../controls.js';
import {SmallMatchCardHeader} from '../matches/Match/MatchCardHeader.js';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Typist from 'react-typist';
import * as Sponsor from './Sponsors.js';
//import {Eetfestijn} from './Eetfestijn.js';


const WeirdLocaleYearInfo = ({params}) => ( // eslint-disable-line
  <div>
    <h2>
      WIJZIGING ZAAL
    </h2>
    <b>Opgelet: TTC Erembodegem speelt niet meer op Groeneweg 28</b>

    <br />

    <h3>Sportzaal Technigo</h3>
    <b>{params.location}</b>
    <br />
    {params.trainingDays}
    <br />
    {params.competitionDays}
    <br />
  </div>
);


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
@withStyles(require('./App.css'))
export default class Intro extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.map.isRequired,
    user: PropTypes.UserModel,
    players: PropTypes.PlayerModelList.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
    viewport: PropTypes.viewport,
  };

  render() {
    var inClub = {
      players: this.props.players.size,
      teamsSporta: this.props.teams.filter(t => t.competition === 'Sporta').size,
      teamsVttl: this.props.teams.filter(t => t.competition === 'Vttl').size,
    };

    const big = this.props.viewport.width > 800;
    var topSponsors;
    if (big) {
      topSponsors = (
        <Row style={{marginTop: 10}}>
          <div style={{width: 480, margin: 'auto'}}>
            <Sponsor.BakkerijVanLierde big={big} />
            <Sponsor.SlagerijGuy big={big} />
          </div>
        </Row>
      );
    }

    return (
      <div>
        {topSponsors}
        <Row style={{marginTop: big ? 25 : undefined}}>
          <Col sm={6} style={{verticalAlign: 'top'}}>
            <h3>{this.context.t('intro.title')}</h3>
            <ClubLocationInstructions />

            {this.context.t('intro.text', inClub)}
            <WeirdLocaleYearInfo params={this.props.config.get('params')} />
          </Col>
          <Col sm={6}>
            {!this.props.config.get('initialLoadCompleted') ? (
              <Loading t={this.context.t} bigScreen={this.props.viewport.width > 768} />
            ) : (
              <div>
                <Strike text="Save the date! Eetfestijn 2019 op zaterdag 28 september" />
                <TodaysEvents {...this.props} />
              </div>
            )}
          </Col>
        </Row>
        {big ? (
          <div>
            <Row style={{marginTop: 25, marginBottom: 15}}>
              <div style={{width: 320, margin: 'auto'}}>
                <Sponsor.itenium big={big} />
              </div>
            </Row>
            <Row style={{marginBottom: 15}}>
              <div style={{width: 440, margin: 'auto'}}>
                <Sponsor.Nostech big={big} />
                <Sponsor.StoneDesign big={big} style={{marginLeft: 10, height: 110}} />
              </div>
            </Row>
          </div>
        ) : (
          <Row style={{margin: 10}}>
            <Strike text={this.context.t('intro.ourSponsors')} style={{marginBottom: 5}} />
            <Col>
              <Sponsor.BakkerijVanLierde big={big} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.SlagerijGuy big={big} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.itenium big={big} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.Nostech big={big} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.StoneDesign big={big} />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

// TODO: React warning: setState on unmounted component = Typist (loading schlager is gone too fast now...)
// https://github.com/jstejada/react-typist/issues/6#issuecomment-250910698
class RestartingTypist extends Component {
  static propTypes = {
    timeout: PropTypes.number,
    children: PropTypes.node,
  }
  state = {typing: true}
  done = () => {
    this.setState({typing: false}, () => {
      setTimeout(() => this.setState({typing: true}), this.props.timeout || 1200);
    });
  }
  render() {
    const {children, timeout, ...props} = this.props; // eslint-disable-line
    return this.state.typing ? <Typist {...props} onTypingDone={this.done}>{children}</Typist> : <span>{children}</span>;
  }
}


const Loading = ({t, bigScreen}) => (
  <div style={bigScreen ? undefined : {width: 310, margin: 'auto', marginBottom: 15, marginTop: 15}}>
    <img
      src="/img/schlager.gif"
      style={{borderRadius: 25}}
      title={t('intro.loading')} />

    <div style={{position: 'absolute', top: 5, width: 310, margin: 'auto'}}>
      <div style={{width: 310, textAlign: 'center', color: 'white'}}>
        <RestartingTypist cursor={{show: false}} startDelay={500}>{t('intro.loading')}</RestartingTypist>
      </div>
    </div>
  </div>
);

Loading.propTypes = {
  t: PropTypes.func.isRequired,
  bigScreen: PropTypes.bool.isRequired,
};


class TodaysEvents extends Component {
  static contextTypes = PropTypes.contextTypes;
  static propTypes = {
    config: PropTypes.map.isRequired,
    user: PropTypes.UserModel,
    players: PropTypes.PlayerModelList.isRequired,
    matches: PropTypes.MatchModelList.isRequired,
    teams: PropTypes.TeamModelList.isRequired,
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

    const lastPlayedMatches = this.props.matches
      .filter(cal => cal.date.isBefore(today, 'day'))
      .sort((a, b) => b.date - a.date)
      .take(2);

    return (
      <div>
        {lastPlayedMatches.size ? (
          <div>
            <Strike text={t('intro.playedMatches')} />
            {this._renderMatches(lastPlayedMatches)}
          </div>
        ) : null}
      </div>
    );
  }

  _renderMatches(matches) {
    return (
      <div>
        {matches.map(match => (
          <div style={{padding: 5}} key={match.id}>
            <SmallMatchCardHeader match2={match} user={this.props.user} isOpen={false} config={this.props.config} noScoreEdit />
          </div>
        ))}
      </div>
    );
  }
}
