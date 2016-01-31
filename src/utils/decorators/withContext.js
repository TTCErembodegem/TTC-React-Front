import React, { PropTypes, Component } from 'react'; // eslint-disable-line no-unused-vars
import t from '../../locales.js';

var contextTypes = {
  setTitle: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

function withContext(ComposedComponent) {
  return class WithContext extends Component {
    static childContextTypes = contextTypes;

    getChildContext() {
      return {
        setTitle: (value, params) => document.title = t(value, params) || t('fullClubName'),
        t: t
      };
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };
}

export var contextTypes;
export default withContext;