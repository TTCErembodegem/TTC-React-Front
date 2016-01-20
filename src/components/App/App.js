import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import withContext from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Header from '../skeleton/Header';
import Footer from '../skeleton/Footer';

import * as playerActionCreators from '../../actions/players.js';

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
    children: PropTypes.element,
  };

  componentDidMount() {
    require('../../core/initialLoad.js')(this.props);
  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}