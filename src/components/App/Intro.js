import React, {Component} from 'react';
import PropTypes, {connect, withViewport, withContext, withStyles} from '../PropTypes.js';
import moment from 'moment';
import ClubLocationInstructions from '../other/ClubLocationInstructions.js';

import {Strike} from '../controls.js';
import {SmallMatchCardHeader} from '../matches/Match/MatchCardHeader.js';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Typist from 'react-typist';
import EndOfSeason from '../other/EndOfSeason/EndOfSeason.js';
import {Eetfestijn} from './Eetfestijn.js';
import IntroClub from './IntroClub.js';
import {WeirdLocaleYearInfo} from './WeirdLocaleYearInfo.js';
import IntroSponsors from './IntroSponsors.js';


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
    if (this.props.config.get('params').endOfSeason) {
      return <EndOfSeason />;
    }

    const big = this.props.viewport.width > 830;
    return (
      <div>
        <Row style={{marginTop: big ? 25 : undefined}}>
          <Col lg={6} md={12} style={{verticalAlign: 'top'}}>
            <IntroClub />
            <WeirdLocaleYearInfo params={this.props.config.get('params')} />
            <ClubLocationInstructions />
          </Col>
          <Col lg={6} md={12}>
            {!this.props.config.get('initialLoadCompleted') ? (
              <Loading t={this.context.t} bigScreen={this.props.viewport.width > 768} />
            ) : (
              <div>
                <div style={{clear: 'both'}} />
                {false && <Eetfestijn />}
                {false && <TodaysEvents {...this.props} />}
                <Plandisc />
              </div>
            )}
          </Col>
        </Row>
        <IntroSponsors />
      </div>
    );
  }
}

const Plandisc = () => (
  <div style={{maxWidth: 1000, width: '50%', margin: 'auto', marginTop: 20}}>
    <div style={{position: 'relative', paddingBottom: '117%', paddingTop: 35, height: 0, overflow: 'hidden'}}>
      <iframe
        src="https://create.plandisc.com/wheel/embed/CKKWdyW"
        scrolling="no"
        frameBorder="0"
        title="TTC Aalst"
        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
      />
    </div>
  </div>
);


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
