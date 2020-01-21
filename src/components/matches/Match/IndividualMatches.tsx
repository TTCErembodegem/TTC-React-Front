import React, {Component} from 'react';
import cn from 'classnames';
import Table from 'react-bootstrap/lib/Table';
import PropTypes, {connect, withViewport, storeUtil} from '../../PropTypes';
import {matchOutcome} from '../../../models/MatchModel';
import {OpponentPlayerLabel} from './OpponentPlayer';
import {TrophyIcon} from '../../controls/Icons/TrophyIcon';
import {PlayerLink} from '../../players/controls/PlayerLink';
import {FrenoyLink} from '../../controls/Buttons/FrenoyButton';
import {IMatch, Competition, Viewport} from '../../../models/model-interfaces';

type IndividualMatchesProps = {
  match: IMatch;
  ownPlayerId: number;
}

type IndividualMatchesState = {
  pinnedPlayerId: number;
}

class IndividualMatches extends Component<IndividualMatchesProps, IndividualMatchesState> {
  static contextTypes = PropTypes.contextTypes;

  constructor(props) {
    super(props);
    this.state = {pinnedPlayerId: props.ownPlayerId};
  }

  render() {
    const {t} = this.context;
    const matchResult = {home: 0, out: 0};

    return (
      <Table condensed striped className="match-card-tab-table">
        <thead>
          <tr>
            <th colSpan={2}>{t('match.individual.matchTitle')} {this.props.match.frenoyMatchId}</th>
            <th className="hidden-xs">{t('match.individual.setsTitle')}</th>
            <th>{t('match.individual.resultTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            const matchWonTrophy = game.outcome === matchOutcome.Won ? <TrophyIcon style={{marginRight: 6}} /> : null;
            return (
              <tr
                key={game.matchNumber}
                className={cn({
                  success: game.ownPlayer.playerId === this.state.pinnedPlayerId && game.outcome === matchOutcome.Won,
                  danger: game.ownPlayer.playerId === this.state.pinnedPlayerId && game.outcome !== matchOutcome.Won,
                  accentuate: game.ownPlayer.playerId === this.props.ownPlayerId,
                })}
                onClick={this._onIndividualMatchChange.bind(this, game.ownPlayer.playerId)}
              >
                {!game.isDoubles ? ([
                  <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="1">
                    {matchWonTrophy}
                    {this._getPlayerDesc(game.home)}
                  </td>,
                  <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2">{this._getPlayerDesc(game.out)}</td>,
                ]) : (
                  <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2" colSpan={2}>
                    {matchWonTrophy}
                    {t('match.double')}
                  </td>
                )}
                <td key="3" className="hidden-xs">{game.homeSets}-{game.outSets}</td>
                <td key="4">{matchResult.home}-{matchResult.out}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  _getPlayerDesc(player) {
    if (!player.playerId) {
      return <OpponentPlayerLabel player={player} competition={this.props.match.competition} fullName />;
    }

    const realPlayer = storeUtil.getPlayer(player.playerId);
    if (realPlayer) {
      return <PlayerLink player={realPlayer} />;
    }
    return player.alias;
  }

  _onIndividualMatchChange(selectedPlayerId) {
    this.setState(prevState => ({pinnedPlayerId: prevState.pinnedPlayerId === selectedPlayerId ? null : selectedPlayerId}));
  }
}







export class ReadonlyIndividualMatches extends Component<{match: IMatch}> {
  static contextTypes = PropTypes.contextTypes;

  constructor(props) {
    super(props);
    this.state = {pinnedPlayerIndex: null};
  }

  render() {
    const {t} = this.context;
    const matchResult = {home: 0, out: 0};

    return (
      <Table striped condensed className="match-card-tab-table">
        <thead>
          <tr>
            <th colSpan={2}>{t('match.report.title')}</th>
            <th>{t('match.individual.setsTitle')}</th>
            <th><span className="hidden-xs">{t('match.individual.resultTitle')}</span></th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            const highlightRow = game.home.uniqueIndex === this.state.pinnedPlayerIndex || game.out.uniqueIndex === this.state.pinnedPlayerIndex;
            return (
              <tr key={game.matchNumber} className={cn({success: highlightRow})}>
                {!game.isDoubles ? ([
                  <td key="1">
                    <ReadonlyMatchPlayerLabel
                      competition={this.props.match.competition}
                      game={game}
                      homePlayer
                      onClick={() => this.setState({pinnedPlayerIndex: game.home.uniqueIndex})}
                    />
                  </td>,
                  <td key="2">
                    <ReadonlyMatchPlayerLabel
                      competition={this.props.match.competition}
                      game={game}
                      homePlayer={false}
                      onClick={() => this.setState({pinnedPlayerIndex: game.out.uniqueIndex})}
                    />
                  </td>,
                ]) : (
                  <td key="2" colSpan={2}>{t('match.double')}</td>
                )}
                <td key="3">{game.homeSets}-{game.outSets}</td>
                <td key="4">{matchResult.home}-{matchResult.out}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

type ReadonlyMatchPlayerLabelComponentProps = {
  game?: any;
  homePlayer: boolean;
  competition: Competition;
  viewport: Viewport;
  onClick: Function;
}


class ReadonlyMatchPlayerLabelComponent extends Component<ReadonlyMatchPlayerLabelComponentProps> {
  static contextTypes = PropTypes.contextTypes;

  render() {
    const {game, homePlayer, competition, viewport, onClick} = this.props;
    const ply = homePlayer ? game.home : game.out;
    const won = (homePlayer && game.outcome === matchOutcome.Won) || (!homePlayer && game.outcome === matchOutcome.Lost);
    return (
      <span className={cn({accentuate: won})} style={{display: 'inline-block'}}>
        {won && viewport.width > 500 ? <TrophyIcon style={{marginRight: 8}} /> : null}
        <span role="button" onClick={onClick} className="clickable" tabIndex={0}>
          {viewport.width > 800 ? ply.name : ply.alias}
        </span>
        &nbsp;&nbsp;
        {viewport.width > 350 && (
          <FrenoyLink competition={competition} uniqueIndex={ply.uniqueIndex}>
            {viewport.width > 400 ? `${ply.ranking} ` : null}
          </FrenoyLink>
        )}
      </span>
    );
  }
}

const ReadonlyMatchPlayerLabel = withViewport(ReadonlyMatchPlayerLabelComponent);

export default connect(state => ({ownPlayerId: state.user.playerId}))(IndividualMatches);
