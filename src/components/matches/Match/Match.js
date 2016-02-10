import React, { PropTypes, Component } from 'react';
import MatchModel, { matchOutcome } from '../../../models/MatchModel.js';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';


import MatchCard from './MatchCard.js';
import MatchPlayers from './MatchPlayers.js';
import IndividualMatches from './IndividualMatches.js';

// import Icon from '../../controls/Icon';

import CardText from 'material-ui/lib/card/card-text';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
// import cn from 'classnames';

const matchPropTypes = {
  match: PropTypes.instanceOf(MatchModel).isRequired,
  user: PropTypes.object.isRequired,
};

export class MatchToday extends Component {
  static contextTypes = contextTypes;
  static propTypes = matchPropTypes;

  render() {
    return (
      <MatchCard {...this.props}>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
      </MatchCard>
    );
  }
}


export class MatchNext extends Component {
  static contextTypes = contextTypes;
  static propTypes = matchPropTypes;

  render() {
    return (
      <MatchCard {...this.props}>
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
      </MatchCard>
    );
  }
}

export class MatchPlayed extends Component {
  static contextTypes = contextTypes;
  static propTypes = matchPropTypes;

  constructor(props) {
    super(props);

    this.state = {
      openTabKey: 1
    };
  }

  render() {
    return (
      <MatchCard {...this.props} backgroundColor="#fafafa">
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            <NavItem eventKey={1} title={this.context.t('match.tabs.playersTitle')}>{this.context.t('match.tabs.players')}</NavItem>
            <NavItem eventKey={2} title={this.context.t('match.tabs.matchesTitle')}>{this.context.t('match.tabs.matches')}</NavItem>
            <NavItem eventKey={3} title={this.context.t('match.tabs.reportTitle')}>{this.context.t('match.tabs.report')}</NavItem>
          </Nav>
          {this._renderTabContent()}
        </CardText>
      </MatchCard>
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

    return <MatchPlayers report={report} team={this.props.match.getTeam()} t={this.context.t} />;
  }


  _renderIndividualMatches() {
    var report = this.props.match.report;
    if (!report.games.length) {
      return null;
    }

    return <IndividualMatches report={report} ownPlayerId={this.props.user.playerId} t={this.context.t} />;
  }

  _renderReport() {
    return (
      <div></div>
    );
  }
}