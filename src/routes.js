import React from 'react';
import { Route } from 'react-router';

//import ContentPage from './components/ContentPage';
import App from './components/App';

export default (
  <div>
    <Route path="/" component={App}/>
  </div>
);


// import React from 'react';
// import Router from 'react-routing/src/Router'; // begone!
// import http from './core/HttpClient';
//
// import ContentPage from './components/ContentPage';
// import LoginPage from './components/LoginPage';
// import NotFoundPage from './components/NotFoundPage';
// import ErrorPage from './components/ErrorPage';

// const router = new Router(on => {
//   on('*', async (state, next) => {
//     const component = await next();
//     return component && <App context={state.context}>{component}</App>;
//   });

//   on('/login', async () => <LoginPage />);

//   on('*', async (state) => {
//     console.log(state);
//     //const content = {content: await http.get(`/api/Config`), path: state.path};
//     const content = {content: 'content', path: state.path};
//     return content && <ContentPage {...content} />;
//   });

//   on('error', (state, error) => state.statusCode === 404 ?
//     <App context={state.context} error={error}><NotFoundPage /></App> :
//     <App context={state.context} error={error}><ErrorPage /></App>
//   );
// });

// export default router;
