import React from 'react';
import Router from 'react-routing/src/Router';
//import http from './core/HttpClient';
import App from './components/App';
import ContentPage from './components/ContentPage';
import LoginPage from './components/LoginPage';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/login', async () => <LoginPage />);

  on('*', async (state) => {
    //const content = await http.get(`/api/content?path=${state.path}`);
    const content = {content: 'WebApi calls comes here... called: ' + state.path};
    return content && <ContentPage {...content} />;
  });

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;
