import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router'

import styles from './Footer.css';
import withViewport from '../../../decorators/withViewport.js';
import withStyles from '../../../decorators/withStyles.js';

@withViewport
@withStyles(styles)
export default class Footer extends Component {
  static propTypes = {
    viewport: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
  };

  render() {
    // This is just an example how one can render CSS
    const { width, height } = this.props.viewport;
    //this.renderCss(`.Footer-viewport:after {content:' ${width}x${height}';}`);

    return (
      <div className="Footer">
        <div className="Footer-container">
          <Link className="Footer-link" to="/">Home</Link>
          <span className="Footer-spacer">·</span>
          <Link className="Footer-link" to="/privacy">Privacy</Link>
          <span className="Footer-spacer">·</span>
          <Link className="Footer-link" to="/not-found">Not Found</Link>
          <span className="Footer-spacer"> | </span>
          <span ref="viewport" className="Footer-viewport Footer-text Footer-text--muted">Viewport: {`${width}x${height}`}</span>
        </div>
      </div>
    );
  }
}