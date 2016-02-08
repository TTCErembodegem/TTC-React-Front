import React, { PropTypes, Component } from 'react';
import MatchModel from '../../../models/Match.js';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Match.css';

import MatchScore from '../MatchScore';
import UserAvatar from '../../User/UserAvatar';

import Icon from '../../controls/Icon';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

@withStyles(styles)
export default class Match extends Component {
  static contextTypes = contextTypes;

  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    userTeams: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  }

  _formatMatchDate() {
    var match = this.props.match;
    if (match.date.minutes()) {
      return match.date.format('D/M HH:mm');
    }
    return match.date.format('D/M HH');
  }

  render() {
    var match = this.props.match;
    var score = match.report ? <MatchScore report={match.report} /> : null;
    var iPlay = this.props.userTeams.indexOf(match.reeksId) !== -1;

    return (
      <div className="col-md-4" style={{padding: 5}}>
        <Card style={{backgroundColor: '#f6f6f6'}}>
          <CardHeader
            title={this.context.t('match.vs', {home: match.getTeamDesc(), away: match.getOpponentDesc()})}
            subtitle={this.context.t('match.date', this._formatMatchDate())}
            actAsExpander={true}
            showExpandableButton={true}
            avatar={iPlay ? <UserAvatar /> : null}>
            {score}
          </CardHeader>
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
      </div>
    );
  }
}