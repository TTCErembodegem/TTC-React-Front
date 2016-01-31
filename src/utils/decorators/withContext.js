import React, { PropTypes, Component } from 'react'; // eslint-disable-line no-unused-vars
import emptyFunction from 'fbjs/lib/emptyFunction';

var contextTypes = {
  setTitle: PropTypes.func.isRequired,
};

function withContext(ComposedComponent) {
  return class WithContext extends Component {
    static contextTypes = contextTypes;

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };
}

export var contextTypes;
export default withContext;