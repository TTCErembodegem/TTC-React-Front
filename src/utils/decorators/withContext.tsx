import React, {Component} from 'react';
import t from '../../locales';

function withContext(ComposedComponent) {
  return class WithContext extends Component {
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

export default withContext;
