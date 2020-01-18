import React from 'react';
import PropTypes, {connect, withTracker} from '../PropTypes';
import {FullScreenSpinner} from '../controls/controls/Spinner';
import App from './App';

// Just adding a root Route that does the ga would be easier:
// https://github.com/react-ga/react-ga/issues/122#issuecomment-319546248


class ComponentWithLayoutComponent extends React.Component {
  static propTypes ={
    Component: PropTypes.any.isRequired,
    config: PropTypes.map.isRequired,
  }

  render() {
    const {Component, config, ...props} = this.props;
    return (
      <App {...props}>
        {config.get('initialLoadCompleted') ? <Component {...props} /> : <FullScreenSpinner />}
      </App>
    );
  }
}

export const ComponentWithLayout = withTracker(connect(state => ({config: state.config}))(ComponentWithLayoutComponent));
