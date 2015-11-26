import React, { PropTypes, Component } from 'react';
import styles from './App.css';
import withContext from '../../decorators/withContext.js';
import withStyles from '../../decorators/withStyles.js';
import Header from '../Header';
import Footer from '../Footer';
import TodoApp from '../Todo/TodoApp.js';

@withContext
@withStyles(styles)
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  render() {
    return !this.props.error ? (
      <div>
        <Header />
        {this.props.children}

        <TodoApp />

        <Footer />
      </div>
    ) : this.props.children;
  }

}

export default App;
