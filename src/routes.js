import React from 'react';
import { Route } from 'react-router';

import App from './components/App';
import Players from './components/players/Players';

export default (
  <div>
    <Route path="/" component={App}>
      <Route path="/spelers" component={Players} />
    </Route>
  </div>
);