import PropTypes from 'prop-types'; // eslint-disable-line no-unused-vars
import React, {Component} from 'react';
import t from '../../locales';

function withContext(ComposedComponent) {
  return class WithContext extends Component {
    static childContextTypes = contextTypes;

    getChildContext() {
      return {
        setTitle: (value, params) => {
          document.title = value ? t(value, params) : t('fullClubName');
        },
        t,
      };
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };
}

export var contextTypes = {
  setTitle: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withContext;
