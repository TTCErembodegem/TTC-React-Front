import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import withContext from '../../utils/decorators/withContext.js';
import withStyles from '../../utils/decorators/withStyles.js';
import styles from './App.css';

import Header from '../skeleton/Header';
import Footer from '../skeleton/Footer';

import Spinner from '../controls/Spinner.js';
import Matches from '../matches/Matches';

function renderApp(children) {
  return (
    <div>
      <Header />
      <div className="container" style={{paddingTop: 5}}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

@connect(state => {
  return {
    config: state.config,
    // players: state.players,
    // clubs: state.clubs,
    // calendar: state.calendar,
    // teams: state.teams
  };
})
@withContext
@withStyles(styles)
export default class App extends Component {
  static propTypes = {
    config: PropTypes.shape({
      initialLoadCompleted: PropTypes.bool.isRequired
    }).isRequired,
    children: PropTypes.element,
  };

  render() {
    if (!this.props.config.initialLoadCompleted) {
      return renderApp(<Spinner size={5} />);
    }
    return renderApp(this.props.children || <Matches />);
  }
}