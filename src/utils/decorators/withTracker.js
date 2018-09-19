import React from 'react';
// import GoogleAnalytics from 'react-ga';

// GoogleAnalytics.initialize('UA-0000000-0');

export const withTracker = (WrappedComponent, options = {}) => { // eslint-disable-line
  const trackPage = page => {
    // GoogleAnalytics.set({
    //   page,
    //   ...options,
    // });
    // GoogleAnalytics.pageview(page);

    //console.log('ga', page);
    if (window.ga) {
      window.ga('set', 'page', page);
      window.ga('send', 'pageview');
    }
  };

  const HOC = class extends React.Component {
    componentDidMount() {
      const page = this.props.location.pathname; // eslint-disable-line
      trackPage(page);
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
};
