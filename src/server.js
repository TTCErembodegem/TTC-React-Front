import 'babel-core/polyfill';
import path from 'path';
import express from 'express';

const server = global.server = express();

server.set('port', (process.env.PORT || 5000));

const publicPath = path.join(__dirname, 'public');
server.use(express.static(publicPath));
server.use((req, res) => {
  res.sendFile(`${publicPath}/index.html`);
});

// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${server.get('port')}`);
  if (process.send) {
    process.send('online');
  }
});
