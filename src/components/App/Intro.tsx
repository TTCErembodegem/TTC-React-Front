import React from 'react';
import moment from 'moment';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import t from '../../locales';
import ClubLocationInstructions from '../other/ClubLocationInstructions';
import {Strike} from '../controls/controls/Strike';
// import {SmallMatchCardHeader} from '../matches/Match/MatchCardHeader';
import EndOfSeason from '../other/EndOfSeason/EndOfSeason';
import {Eetfestijn} from './Eetfestijn';
import IntroClub from './IntroClub';
import {WeirdLocaleYearInfo} from './WeirdLocaleYearInfo';
import IntroSponsors from './IntroSponsors';
import {IMatch, IConfig, IPlayer, ITeam, Viewport} from '../../models/model-interfaces';
// import {IUser} from '../../models/UserModel';
import { useViewport } from '../../utils/hooks/useViewport';
import { useTtcSelector } from '../../utils/hooks/storeHooks';

require('./App.css');

const Intro = () => {
  const viewport = useViewport();
  // const config = useTtcSelector(state => state.config);
  const config = {
    get: str => false
  }

  if (config.get('endOfSeason')) {
    return <EndOfSeason />;
  }

  const big = viewport.width > 830;
  return (
    <div>
      <Row style={{marginTop: big ? 25 : undefined}}>
        <Col sm={6} style={{verticalAlign: 'top'}}>
          <IntroClub />
          <WeirdLocaleYearInfo params={config.get('params')} />
          <ClubLocationInstructions />
        </Col>
        <Col sm={6}>
          {!config.get('initialLoadCompleted') ? (
            <Loading bigScreen={viewport.width > 768} />
          ) : (
            <div>
              <div style={{clear: 'both'}} />
              {false && <Eetfestijn />}
              <TodaysEvents />
            </div>
          )}
        </Col>
      </Row>
      <IntroSponsors />
    </div>
  );
}

export default Intro;


const Loading = ({bigScreen}: {bigScreen: boolean}) => (
  <div style={bigScreen ? undefined : {width: 310, margin: 'auto', marginBottom: 15, marginTop: 15}}>
    <img
      src="/img/schlager.gif"
      style={{borderRadius: 25}}
      title={t('intro.loading')}
      alt="Busy TT player spinner"
    />

    <div style={{position: 'absolute', top: 5, width: 310, margin: 'auto'}}>
      <div style={{width: 310, textAlign: 'center', color: 'white'}}>
        {t('intro.loading')}
      </div>
    </div>
  </div>
);


const TodayEventMatches = ({matches}: {matches: IMatch[]}) => (
  matches.map(match => (
    <div style={{padding: 5}} key={match.id}>
      {/* <SmallMatchCardHeader match2={match} user={this.props.user} isOpen={false} config={this.props.config} noScoreEdit /> */}
    </div>
  ))
)

const TodaysEvents = () => {
  const matches = useTtcSelector(state => state.matches);
  const today = moment();

  const matchesToday = matches.filter(cal => cal.date.isSame(today, 'day'));
  if (matchesToday.length) {
    return (
      <div>
        <Strike text={t('intro.matchesToday')} />
        <TodayEventMatches matches={matchesToday} />
      </div>
    );
  }

  const lastPlayedMatches = matches
    .filter(cal => cal.date.isBefore(today, 'day'))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, 2);

  return (
    <div>
      {lastPlayedMatches.length && (
        <div>
          <Strike text={t('intro.playedMatches')} />
          <TodayEventMatches matches={lastPlayedMatches} />
        </div>
      )}
    </div>
  );
}
