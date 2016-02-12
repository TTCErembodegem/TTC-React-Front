import React, { PropTypes, Component } from 'react';
import { contextTypes } from '../../../utils/decorators/withContext.js';

import MatchModel from '../../../models/MatchModel.js';

import FavoriteMatch from '../FavoriteMatch.js';
import MatchScore from '../MatchScore.js';

import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';

const cardClosedSize = 4;
const cardOpenedSize = 8;

export default class MatchCardPlaceHolder extends Component {
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
  }

  render() {
    var match = this.props.match;
    var score = match.report ? <MatchScore match={match} /> : null;
    var iPlay = this.props.user.playsIn(match.teamId);
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
    this.setState({columnSize: isOpen ? cardOpenedSize : cardClosedSize});
  }
}