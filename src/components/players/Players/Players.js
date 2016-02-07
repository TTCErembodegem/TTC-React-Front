import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { contextTypes } from '../../../utils/decorators/withContext.js';
import withStyles from '../../../utils/decorators/withStyles.js';
import styles from './Players.css';

import { players as playerActionCreators } from '../../../actions/players.js';
// TODO: playerActionCreators: no longer called from here (but illustration how actionCreators can be passed as props)

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
export default class Players extends Component {
  static contextTypes = contextTypes;
  static propTypes = {
    config: PropTypes.object,
    players: PropTypes.array,
  };

  componentDidMount() {
    this.context.setTitle('players.title', {a: 5}); // TODO: just an example of context, setTitle and translation with params
  }

  render() {
    return (
      <div>
        {this.props.players.filter(x => x.id < 10).map(ply => <div key={ply.id}>{ply.id + ': ' + ply.name}</div>)}
      </div>
    );
  }
}