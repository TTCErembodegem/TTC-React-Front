import React, { PropTypes, Component } from 'react';
import MatchModel, { matchOutcome } from '../../../models/MatchModel.js';

import { contextTypes } from '../../../utils/decorators/withContext.js';

import MatchCardHeader from './MatchCardHeader.js';
import MatchPlayers from './MatchPlayers.js';
import IndividualMatches from './IndividualMatches.js';

// import Icon from '../../controls/Icon';

import CardText from 'material-ui/lib/card/card-text';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
// import cn from 'classnames';

export default class MatchCard extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    match: PropTypes.instanceOf(MatchModel).isRequired,
    user: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      openTabKey: 1
    };
  }

  render() {
    return (
      <MatchCardHeader {...this.props} backgroundColor="#fafafa">
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            <NavItem eventKey={1} title={this.context.t('match.tabs.playersTitle')}>{this.context.t('match.tabs.players')}</NavItem>
            <NavItem eventKey={2} title={this.context.t('match.tabs.matchesTitle')}>{this.context.t('match.tabs.matches')}</NavItem>
            <NavItem eventKey={3} title={this.context.t('match.tabs.reportTitle')}>{this.context.t('match.tabs.report')}</NavItem>
          </Nav>
          {this._renderTabContent()}
        </CardText>
      </MatchCardHeader>
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