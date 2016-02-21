import React, { PropTypes, Component } from 'react';
import { contextTypes } from '../../../utils/decorators/withContext.js';
import moment from 'moment';

import MatchModel from '../../../models/MatchModel.js';

import FavoriteMatch from '../FavoriteMatch.js';
import MatchScore from '../MatchScore.js';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';

const cardClosedSize = 4;
const cardOpenedSize = 8;
const daysAgoBackFullDate = 7;

export default class MatchCardHeader extends Component {
  constructor() {
    super();
    this.state = {
      columnSize: cardClosedSize
    };
  }

  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.object.isRequired,
    backgroundColor: PropTypes.string,
    children: PropTypes.node.isRequired,
    getLastOpponentMatches: PropTypes.func.isRequired
  }

  render() {
    var match = this.props.match;
    var iPlay = this.props.user.playsIn(match.teamId);
    var score = <MatchScore match={match} />;
    var cardStyle = this.props.backgroundColor ? {backgroundColor: this.props.backgroundColor} : null;

    var subtitle = [];
    if (match.date.isSame(moment(), 'day') && match.isHomeMatch) {
      subtitle.push(<span style={{marginRight: 9}} key="1">{match.frenoyMatchId}</span>);
      subtitle.push(<span key="2">{this.context.t('match.date', match.getDisplayDate())}</span>);
    } else {
      subtitle.push(
        <span key="2">{match.date > moment() || match.date < moment().add(-daysAgoBackFullDate, 'day') ?
          this.context.t('match.date', match.getDisplayDate())
          : match.date.fromNow()}
        </span>
      );
    }
    return (
      <div className={'col-md-' + this.state.columnSize} style={{padding: 5}}>
        <Card style={cardStyle} onExpandChange={::this._onExpandChange}>
          <CardHeader
            title={this.context.t('match.vs', {
              [match.isHomeMatch ? 'home' : 'away']: match.getTeamDesc(),
              [match.isHomeMatch ? 'away' : 'home']: match.getOpponentDesc()
            })}
            subtitle={subtitle}
            showExpandableButton={true}
            actAsExpander={true}
            avatar={iPlay ? <FavoriteMatch /> : null}>
            {score}
          </CardHeader>
          {this.props.children}
        </Card>
      </div>
    );
  }

  _onExpandChange(isOpen) {
    if (isOpen) {
      // TODO: request only once
      //this.props.getLastOpponentMatches(this.props.match.opponent);
    }
    this.setState({columnSize: isOpen ? cardOpenedSize : cardClosedSize});
  }
}