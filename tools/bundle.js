import webpack from 'webpack';
import task from './lib/task';
import config from './config';

/**
 * Bundles JavaScript, CSS and images into one or more packages
 * ready to be used in a browser.
 */
export default task('bundle', async () => new Promise((resolve, reject) => {
  const bundler = webpack(config);
  let bundlerRunCount = 0;

  function bundle(err, stats) {
    if (err) {
      return reject(err);
    }

    console.log(stats.toString(config[0].stats));

    if (++bundlerRunCount === (global.WATCH ? config.length : 1)) {
      return resolve();
    }
  }

  if (global.WATCH) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
}));
