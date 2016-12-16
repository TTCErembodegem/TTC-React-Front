import React, { Component } from 'react';
import PropTypes, { connect, withViewport, withContext, withStyles } from '../PropTypes.js';
import moment from 'moment';

import Strike from '../controls/Strike.js';
import MatchCardHeader from '../matches/Match/MatchCardHeader.js';
import Location from '../controls/Location.js';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Paper from 'material-ui/Paper';
import Typist from 'react-typist';
import * as Sponsor from './Sponsors.js';

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
      topSponsors = (
        <Row style={{marginTop: 10}}>
          <div style={{width: 460, margin: 'auto'}}>
            <Sponsor.BakkerijVanLierde top={showTopSponsors} />
            <Sponsor.SlagerijGuy top={showTopSponsors} />
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
        {topSponsors}
        <Row style={{marginTop: showTopSponsors ? 25 : undefined}}>
          <Col sm={6} style={{verticalAlign: 'top'}}>
            <h1>{this.context.t('intro.title')}</h1>
            {this.context.t('intro.text', inClub)}
          </Col>
          <Col sm={6}>
            {!this.props.config.get('initialLoadCompleted') ? (
              <Loading t={this.context.t} bigScreen={this.props.viewport.width > 768} />
            ) : <TodaysEvents {...this.props} />}
          </Col>
        </Row>
        {showTopSponsors ? (
          <div>
            <Row style={{marginTop: 25, marginBottom: 15}}>
              <div style={{width: 770, margin: 'auto'}}>
                <Sponsor.StoneDesign top={showTopSponsors} />
                <Sponsor.Symphony top={showTopSponsors} style={{marginLeft: 10}} />
                <Sponsor.Vdhkeukens top={showTopSponsors} style={{marginLeft: 10}} />
              </div>
            </Row>
            <Row style={{marginBottom: 15}}>
              <div style={{width: 500, margin: 'auto'}}>
                <Sponsor.Nostech top={showTopSponsors} style={{}} />
                <Sponsor.pongit top={showTopSponsors} style={{marginLeft: 10}} />
              </div>
            </Row>
          </div>
        ) : null}
        {!showTopSponsors ? (
          <Row style={{margin: 10}}>
            <Strike text={this.context.t('intro.ourSponsors')} style={{marginBottom: 5}} />
            <Col>
              <Sponsor.BakkerijVanLierde top={showTopSponsors} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.SlagerijGuy top={showTopSponsors} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.Symphony top={showTopSponsors} style={{}} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.Vdhkeukens top={showTopSponsors} style={{}} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.pongit top={showTopSponsors} style={{}} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.Nostech top={showTopSponsors} style={{}} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.StoneDesign top={showTopSponsors} />
            </Col>
          </Row>
        ) : null}
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
    this.setState({ typing: false }, () => {
      setTimeout(() => this.setState({ typing: true }), this.props.timeout || 1200);
    });
  }
  render() {
    const {children, timeout, ...props} = this.props;
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
        <Strike text="Nieuwjaarsreceptie: zaterdag 7/1/2017 vanaf 19u30" />
        {trainingEvent}
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
            <MatchCardHeader match={match} user={this.props.user} isOpen={false} config={this.props.config} noScoreEdit />
          </div>
        ))}
      </div>
    );
  }
}