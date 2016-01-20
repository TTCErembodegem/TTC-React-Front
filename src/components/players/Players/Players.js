import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import withContext from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

import * as playerActionCreators from '../../../actions/players.js';

@connect(state => {
  return {
    players: state.players,
    clubs: state.clubs,
    calendar: state.calendar,
    teams: state.teams,
  };
}, playerActionCreators)
@withContext
@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    players: PropTypes.array,
  };

  render() {
    return (
      <div>
        {this.props.players.map(ply => <div key={ply.id}>{ply.id + ': ' + ply.name}</div>)}
      </div>
    );
  }
}