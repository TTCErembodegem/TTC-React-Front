import React, {Component, useState} from 'react';
import cn from 'classnames';
import Table from 'react-bootstrap/Table';
import {matchOutcome} from '../../../models/MatchModel';
import {OpponentPlayerLabel} from './OpponentPlayer';
import {TrophyIcon} from '../../controls/Icons/TrophyIcon';
import {PlayerLink} from '../../players/controls/PlayerLink';
import {FrenoyLink} from '../../controls/Buttons/FrenoyButton';
import {IMatch, Competition, IGetGameMatches, IFullMatchOther, IMatchPlayer} from '../../../models/model-interfaces';
import { t } from '../../../locales';
import storeUtil from '../../../storeUtil';
import { useViewport } from '../../../utils/hooks/useViewport';

type IndividualMatchesProps = {
  match: IMatch;
  ownPlayerId: number;
}


export const IndividualMatches = ({match, ownPlayerId}: IndividualMatchesProps) => {
  const [pinnedPlayerId, setPinnedPlayerId] = useState<number | null>(ownPlayerId);
  const matchResult = {home: 0, out: 0};

  return (
    <Table size="sm" striped className="match-card-tab-table">
      <thead>
        <tr>
          <th colSpan={2}>{t('match.individual.matchTitle')} {match.frenoyMatchId}</th>
          <th className="d-none d-sm-table-cell">{t('match.individual.setsTitle')}</th>
          <th>{t('match.individual.resultTitle')}</th>
        </tr>
      </thead>
      <tbody>
        {match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
          matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
          const matchWonTrophy = game.outcome === matchOutcome.Won ? <TrophyIcon style={{marginRight: 6}} /> : null;
          return (
            <tr
              key={game.matchNumber}
              className={cn({
                success: game.ownPlayer.playerId === pinnedPlayerId && game.outcome === matchOutcome.Won,
                danger: game.ownPlayer.playerId === pinnedPlayerId && game.outcome !== matchOutcome.Won,
                accentuate: game.ownPlayer.playerId === ownPlayerId,
              })}
              onClick={() => setPinnedPlayerId(pinnedPlayerId === game.ownPlayer.playerId ? null : game.ownPlayer.playerId)}
            >
              {!game.isDoubles ? ([
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="1">
                  {matchWonTrophy}
                  <PlayerDesc player={game.home} competition={match.competition} />
                </td>,
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2">
                  <PlayerDesc player={game.out} competition={match.competition} />
                </td>,
              ]) : (
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2" colSpan={2}>
                  {matchWonTrophy}
                  {t('match.double')}
                </td>
              )}
              <td key="3" className="d-none d-sm-table-cell">{game.homeSets}-{game.outSets}</td>
              <td key="4">{matchResult.home}-{matchResult.out}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

type PlayerDescProps = {
  player: IMatchPlayer;
  competition: Competition;
}

const PlayerDesc = ({player, competition}: PlayerDescProps) => {
  const viewport = useViewport();
  if (!player.playerId) {
    return <OpponentPlayerLabel player={player} competition={competition} fullName />;
  }

  const realPlayer = storeUtil.getPlayer(player.playerId);
  if (realPlayer) {
    return <PlayerLink player={realPlayer} alias={viewport.width < 700} />;
  }
  return <span>{player.alias}</span>;
};







export class ReadonlyIndividualMatches extends Component<{match: IMatch}, {pinnedPlayerIndex: number}> {
  constructor(props) {
    super(props);
    this.state = {pinnedPlayerIndex: 0};
  }

  render() {
    const matchResult = {home: 0, out: 0};

    return (
      <Table striped size="sm" className="match-card-tab-table">
        <thead>
          <tr>
            <th colSpan={2}>{t('match.report.title')}</th>
            <th>{t('match.individual.setsTitle')}</th>
            <th><span className="d-none d-sm-inline">{t('match.individual.resultTitle')}</span></th>
          </tr>
        </thead>
        <tbody>
          {this.props.match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            const highlightRow = game.home?.uniqueIndex === this.state.pinnedPlayerIndex || game.out?.uniqueIndex === this.state.pinnedPlayerIndex;
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

type ReadonlyMatchPlayerLabelProps = {
  game: IGetGameMatches;
  homePlayer: boolean;
  competition: Competition;
  onClick: Function;
}


const ReadonlyMatchPlayerLabel = ({game, homePlayer, competition, onClick}: ReadonlyMatchPlayerLabelProps) => {
  const viewport = useViewport();
  const ply = homePlayer ? game.home : game.out;
  const won = (homePlayer && game.outcome === matchOutcome.Won) || (!homePlayer && game.outcome === matchOutcome.Lost);
  return (
    <span className={cn({accentuate: won})} style={{display: 'inline-block'}}>
      {won && viewport.width > 500 ? <TrophyIcon style={{marginRight: 8}} /> : null}
      <span role="button" onClick={() => onClick()} className="clickable" tabIndex={0}>
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
};
