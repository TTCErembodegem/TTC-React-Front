import React, { PropTypes, Component } from 'react';
import MatchModel from '../../../models/MatchModel.js';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Match.css';

import MatchScore from '../MatchScore';
import UserAvatar from '../../User/UserAvatar';

const cardClosedSize = 4;
const cardOpenedSize = 8;

import Icon from '../../controls/Icon';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

const matchPropTypes = {
  match: PropTypes.instanceOf(MatchModel).isRequired,
  userTeams: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
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


@withStyles(styles)
export class MatchPlayed extends Component {
  static contextTypes = contextTypes;
  static propTypes = matchPropTypes;

  render() {
    var players = null;
    if (this.props.match.report && this.props.match.report.players.length) {
      let report = this.props.match.report;

      players = report.getOwnClubPlayers().map(player => <div key={player.position}>{player.name + ': ' + player.won}</div>);
    }

    return (
      <Match {...this.props} backgroundColor="#fafafa">
        <CardText expandable={true}>
          {players}
        </CardText>
      </Match>
    );
  }
}


class Match extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    userTeams: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
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
    var iPlay = this.props.userTeams.indexOf(match.reeksId) !== -1;
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
            avatar={iPlay ? <UserAvatar /> : null}>
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