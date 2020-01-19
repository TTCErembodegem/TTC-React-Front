import React from 'react';
import {connect, withTracker} from '../PropTypes';
import {FullScreenSpinner} from '../controls/controls/Spinner';
import App from './App';

// Just adding a root Route that does the ga would be easier:
// https://github.com/react-ga/react-ga/issues/122#issuecomment-319546248

type ComponentWithLayoutComponentProps = {
  Component: any;
  config: any;
}

// eslint-disable-next-line react/prefer-stateless-function
class ComponentWithLayoutComponent extends React.Component<ComponentWithLayoutComponentProps> {
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
