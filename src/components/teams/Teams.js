import React, { PropTypes, Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import moment from 'moment';
import { connect } from 'react-redux';

import MatchModel from '../../models/MatchModel.js';
import TeamModel from '../../models/TeamModel.js';
import { contextTypes } from '../../utils/decorators/withContext.js';
import withViewport from '../../utils/decorators/withViewport.js';

import CardText from 'material-ui/lib/card/card-text';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';

import Strike from '../controls/Strike.js';
import MatchCardHeader from '../matches/Match/MatchCardHeader.js';

export const TeamsVttl = () => <Teams competition="Vttl" />;
export const TeamsSporta = () => <Teams competition="Sporta" />;

@withViewport
@connect(state => {
  return {
    config: state.config,
    user: state.user,
    players: state.players,
    clubs: state.clubs,
    matches: state.matches,
    teams: state.teams,
  };
})
export default class Teams extends Component {
  static contextTypes = contextTypes;
  constructor() {
    super();
    this.state = {openTabKey: 0};
  }

  static propTypes = {
    competition: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    matches: ImmutablePropTypes.listOf(PropTypes.instanceOf(MatchModel).isRequired).isRequired,
    teams: ImmutablePropTypes.listOf(PropTypes.instanceOf(TeamModel).isRequired).isRequired,
    viewport: PropTypes.object.isRequired,
  }

  _showAccordion() {
    // Otherwise show tabs
    return this.props.viewport.width < 700;
  }
  _onTabSelect(eventKey) {
    this.setState({openTabKey: eventKey});
  }

  render() {
    var teams = this.props.teams.filter(team => team.competition === this.props.competition);

    if (this._showAccordion()) {
      return (
        <div style={{marginTop: 10}}>
          <CardText expandable={true} style={{paddingTop: 0, paddingLeft: 5, paddingRight: 5}}>
            <PanelGroup activeKey={this.state.openTabKey} onSelect={::this._onTabSelect} accordion>
              <Panel header={<div>yaye</div>} eventKey={0} className="clickable" onClick={this._onTabSelect.bind(this, 0)}>
                blabla
              </Panel>
            </PanelGroup>
          </CardText>
        </div>
      );
    }

    return (
      <div style={{marginTop: 10}}>
        <CardText expandable={true} style={{paddingTop: 0}}>
          <Nav bsStyle="tabs" activeKey={this.state.openTabKey} onSelect={::this._onTabSelect}>
            <NavItem eventKey={0} title={"whee"/*this.context.t(`match.tabs.${transKey}Title`)*/}>
              bleble
            </NavItem>
          </Nav>
          <div>
            wheeeee
          </div>
        </CardText>
      </div>
    );


    return (
      <div>
        {teams.map(team => "goe bezig " + team.teamCode)}
      </div>
    );
  }
}