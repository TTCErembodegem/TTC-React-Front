import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Matches.css';

import { players as playerActionCreators } from '../../../actions/players.js';

import Match from '../Match/';

@connect(state => {
  return {
    config: state.config,
    players: state.players,
    clubs: state.clubs,
    calendar: state.calendar,
    teams: state.teams,
  };
}, playerActionCreators)
@withStyles(styles)
export default class Matches extends Component {
  static contextTypes = contextTypes;

  componentDidMount() {
    this.context.setTitle();
  }

  render() {
    return (
      <div>
        {this.props.calendar.map((match, i) => <Match {...match} key={i}/>)}
      </div>
    );
  }
}