import React, { PropTypes, Component } from 'react';
import MatchModel, { matchOutcome } from '../../../models/MatchModel.js';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Match.css';

import MatchScore from '../MatchScore';
import FavoriteMatch from '../FavoriteMatch.js';

const cardClosedSize = 4;
const cardOpenedSize = 8;

import Icon from '../../controls/Icon';

import Card from 'material-ui/lib/card/card';
//import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
//import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Table from 'react-bootstrap/lib/Table';

const matchPropTypes = {
  match: PropTypes.instanceOf(MatchModel).isRequired,
  user: PropTypes.object.isRequired,
};

@withStyles(styles)
export class MatchToday extends Component {
  static contextTypes = contextTypes;
  static propTypes = matchPropTypes;

  render() {
    return (
      <Match {...this.props}>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
      </Match>
    );
  }
}


@withStyles(styles)
export class MatchNext extends Component {
  static contextTypes = contextTypes;
  static propTypes = matchPropTypes;

  render() {
    return (
      <Match {...this.props}>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
      </Match>
    );
  }
}

const Opponent = ({ply}) => (
  <div>{`${ply.name} (${ply.ranking}): ${ply.won}`}</div>
);

@withStyles(styles)
export class MatchPlayed extends Component {
  static contextTypes = contextTypes;
  static propTypes = matchPropTypes;

  constructor(props) {
    super(props);

    this.state = {
      openTabKey: 1,
      selectedPlayerId: props.user.playerId
    };
  }

  render() {
    return (
      <Match {...this.props} backgroundColor="#fafafa">
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            <NavItem eventKey={1} title={this.context.t('match.tabs.playersTitle')}>{this.context.t('match.tabs.players')}</NavItem>
            <NavItem eventKey={2} title={this.context.t('match.tabs.matchesTitle')}>{this.context.t('match.tabs.matches')}</NavItem>
            <NavItem eventKey={3} title={this.context.t('match.tabs.reportTitle')}>{this.context.t('match.tabs.report')}</NavItem>
          </Nav>
          {this._renderTabContent()}
        </CardText>
      </Match>
    );
  }
  _onTabSelect(eventKey) {
    this.setState({openTabKey: eventKey});
  }

  _renderTabContent() {
    switch (this.state.openTabKey) {
    case 1:
      return this._renderPlayers();
    case 2:
      return this._renderIndividualMatches();
    }
    return this._renderReport();
  }

  _renderPlayers() {
    var report = this.props.match.report;
    if (!report.players.length) {
      return null;
    }

    return (
      <div>
        <div className="col-md-6">
          <h3>{this.context.t('match.playersVictoryTitle')}</h3>
          {report.getOwnPlayers().map(ply => <div key={ply.position}>{ply.name + ': ' + ply.won}</div>)}
        </div>
        <div className="col-md-6">
          <h3>{this.context.t('match.playersOpponentsTitle')}</h3>
          {report.getTheirPlayers().map(ply => <Opponent ply={ply} key={ply.position} />)}
        </div>
      </div>
    );
  }
  _renderIndividualMatches() {
    var report = this.props.match.report;
    if (!report.games.length) {
      return null;
    }

    var getVictoryIcon = function(game) {
      if (game.outcome === matchOutcome.Won) {
        return <Icon fa="fa fa-trophy" color="#FCB514" />;
      }
    };

    var getPlayerDesc = function(player) {
      if (!player.home) {
        return `${player.nameShort} (${player.ranking})`;
      }
      return player.nameShort;
    };

    var matchResult = {
      home: 0,
      out: 0
    };

    return (
      <Table condensed hover style={{width: '50%'}}>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th colSpan={2}>{this.context.t('match.individual.matchTitle')}</th>
            <th>{this.context.t('match.individual.setsTitle')}</th>
            <th>{this.context.t('match.individual.resultTitle')}</th>
          </tr>
        </thead>
        <tbody>
          {report.getGameMatches().map(game => {
            matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
            var isMarked = this.state.selectedPlayerId === game.home.playerId || this.state.selectedPlayerId === game.out.playerId;
            return (
              <tr key={game.matchNumber} className={isMarked ? 'success' : ''}
                onMouseOver={this._onIndividualMatchChange.bind(this, game.home.playerId || game.out.playerId)}
                onClick={this._onIndividualMatchChange.bind(this, game.home.playerId || game.out.playerId)}>
                <td>{getVictoryIcon(game)}</td>
                <td>{getPlayerDesc(game.home)}</td>
                <td>{getPlayerDesc(game.out)}</td>
                <td>{`${game.homeSets}-${game.outSets}`}</td>
                <td>{`${matchResult.home}-${matchResult.out}`}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
  _onIndividualMatchChange(selectedPlayerId) {
    this.setState({selectedPlayerId});
  }


  _renderReport() {
    return (
      <div></div>
    );
  }
}


class Match extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.object.isRequired,
    backgroundColor: PropTypes.string,
    children: PropTypes.node,
  }

  constructor() {
    super();
    this.state = {
      columnSize: cardClosedSize
    };
  }

  render() {
    var match = this.props.match;
    var score = match.report ? <MatchScore match={match} /> : null;
    var iPlay = this.props.user.teams.indexOf(match.reeksId) !== -1;
    var cardStyle = this.props.backgroundColor ? {backgroundColor: this.props.backgroundColor} : null;

    return (
      <div className={'col-md-' + this.state.columnSize} style={{padding: 5}}>
        <Card style={cardStyle} onExpandChange={::this._onExpandChange}>
          <CardHeader
            title={this.context.t('match.vs', {
              [match.isHomeMatch ? 'home' : 'away']: match.getTeamDesc(),
              [match.isHomeMatch ? 'away' : 'home']: match.getOpponentDesc()
            })}
            subtitle={this.context.t('match.date', match.getDisplayDate())}
            showExpandableButton={true}
            avatar={iPlay ? <FavoriteMatch /> : null}>
            {score}
          </CardHeader>
          {this.props.children}
        </Card>
      </div>
    );
  }

  _onExpandChange(isOpen) {
    this.setState({columnSize: isOpen ? cardOpenedSize : cardClosedSize});
  }
}