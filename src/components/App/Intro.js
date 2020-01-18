import React, {Component} from 'react';
import moment from 'moment';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Typist from 'react-typist';
import PropTypes, {connect, withViewport, withContext, withStyles} from '../PropTypes.js';
import ClubLocationInstructions from '../other/ClubLocationInstructions.js';

import {Strike} from '../controls.js';
import {SmallMatchCardHeader} from '../matches/Match/MatchCardHeader.js';

import EndOfSeason from '../other/EndOfSeason/EndOfSeason.js';
import {Eetfestijn} from './Eetfestijn.js';
import IntroClub from './IntroClub.js';
import {WeirdLocaleYearInfo} from './WeirdLocaleYearInfo.js';
import IntroSponsors from './IntroSponsors.js';

require('./App.css');


class Intro extends Component {
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
    if (this.props.config.get('endOfSeason')) {
      return <EndOfSeason />;
    }

    const big = this.props.viewport.width > 830;
    return (
      <div>
        <Row style={{marginTop: big ? 25 : undefined}}>
          <Col sm={6} style={{verticalAlign: 'top'}}>
            <IntroClub />
            <WeirdLocaleYearInfo params={this.props.config.get('params')} />
            <ClubLocationInstructions />
          </Col>
          <Col sm={6}>
            {!this.props.config.get('initialLoadCompleted') ? (
              <Loading t={this.context.t} bigScreen={this.props.viewport.width > 768} />
            ) : (
              <div>
                <div style={{clear: 'both'}} />
                {false && <Eetfestijn />}
                <TodaysEvents {...this.props} />
              </div>
            )}
          </Col>
        </Row>
        <IntroSponsors />
      </div>
    );
  }
}

export default withContext(withViewport(connect(state => ({
  config: state.config,
  user: state.user,
  players: state.players,
  matches: state.matches,
  teams: state.teams,
}))(Intro)));

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
      title={t('intro.loading')}
    />

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
    const {t} = this.context;
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
