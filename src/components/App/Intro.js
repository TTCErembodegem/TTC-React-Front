import React, {Component} from 'react';
import PropTypes, {connect, withViewport, withContext, withStyles} from '../PropTypes.js';
import moment from 'moment';

import {Strike, Location} from '../controls.js';
import MatchCardHeader from '../matches/Match/MatchCardHeader.js';

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
            <h1>{this.context.t('intro.title')}</h1>
            {this.context.t('intro.text', inClub)}
          </Col>
          <Col sm={6}>
            {!this.props.config.get('initialLoadCompleted') ? (
              <Loading t={this.context.t} bigScreen={this.props.viewport.width > 768} />
            ) : <TodaysEvents {...this.props} />}
          </Col>
        </Row>
        {big ? (
          <div>
            <Row style={{marginTop: 25, marginBottom: 15, marginLeft: -65}}>
              <div style={{width: 650, margin: 'auto'}}>
                <Sponsor.Symphony big={big} style={{padding: 15}} />
                <div className="pull-right">
                  <Sponsor.Vdhkeukens big={big} style={{paddingRight: 20}} />
                  <br />
                  <Sponsor.KachelsTfe big={big} style={{marginTop: 10, paddingRight: 20}} />
                </div>
              </div>
            </Row>
            <Row style={{marginBottom: 15}}>
              <div style={{width: 700, margin: 'auto'}}>
                <Sponsor.Nostech big={big} />
                <Sponsor.pongit big={big} style={{marginLeft: 10}} />
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
              <Sponsor.Symphony big={big} style={{padding: 5}} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.Vdhkeukens big={big} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.KachelsTfe big={big} />
            </Col>
            <Col style={{marginTop: 20}}>
              <Sponsor.pongit big={big} />
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
    // const matchesToday = this.props.matches.filter(cal => cal.date.isSame(today, 'day'));
    // if (matchesToday.size) {
    //   return (
    //     <div>
    //       <Strike text={t('intro.matchesToday')} />
    //       {this._renderMatches(matchesToday)}
    //     </div>
    //   );
    // }

    // TODO: training weekdays & hour hardcoded (+ duplicated in footer)
    var trainingEvent;
    if (today.weekday() === 1 || today.weekday() === 3) {
      trainingEvent = <Strike text={t('intro.trainingToday')} />;
    }

    return (
      <div>
        {trainingEvent}
        <Eetfestijn />
      </div>
    );

    // TODO: Put this back after the Eetfestijn:
    // const lastPlayedMatches = this.props.matches
    //   .filter(cal => cal.date.isBefore(today, 'day'))
    //   .sort((a, b) => b.date - a.date)
    //   .take(2);

    // return (
    //   <div>
    //     <Strike text="Eetfestijn: Zaterdag 23/09/2017 van 18u tot 22u" />
    //     {trainingEvent}
    //     {lastPlayedMatches.size ? (
    //       <div>
    //         <Strike text={t('intro.playedMatches')} />
    //         {this._renderMatches(lastPlayedMatches)}
    //       </div>
    //     ) : null}
    //   </div>
    // );
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

const eetfesijnStyle = {
  padding: 0,
  width: '100%',
  margin: 'auto',
};
const eetfestijnGoogleMaps = "https://maps.google.com/maps?q=Botermelkstraat+63,+9300+Aalst&hl=en&ll=50.953115,4.061058&spn=0.009449,0.023475&sll=50.952442,4.062345&sspn=0.001188,0.002934&t=m&hnear=Botermelkstraat+63,+Aalst+9300+Aalst,+Oost-Vlaanderen,+Vlaams+Gewest,+Belgium&z=16";
const Eetfestijn = () => {
  return (
    <Paper style={eetfesijnStyle}>
      <div id="eetfestijn">
        <h1 style={{fontSize: 26}}>
        Eetfestijn TTC Erembodegem
        <br />
        Zaterdag 23 september 2017
        </h1>

        Van 18u00 tot 22u00 in zaal <a className="eetfestijn" href={eetfestijnGoogleMaps} target="_blank">Sint-Paulus</a>
        <br />
        Botermelkstraat 63, 9300 Aalst

        <br /><br />

        <table width="100%">
          <tbody>
            <tr><th colSpan={2} style={{textAlign: 'center'}}><font size="+1">Menu</font></th></tr>
            <tr>
              <td width="99%"><b>Varkenshaasje</b> met sla, tomaten<br /> en saus naar keuze</td><td width="1%">&euro;17</td>
            </tr>
            <tr>
              <td><b>Kabeljauw</b> met normandische saus</td><td>&euro;17</td>
            </tr>
            <tr>
              <td><b>Kindermenu</b>: kip met appelmoes</td><td><font size="-1">&euro;8,5</font></td>
            </tr>
          </tbody>
        </table>

        <br />
        <span>Steunkaarten ook beschikbaar voor &euro;2.50</span>
      </div>
    </Paper>
  )
}

