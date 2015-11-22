import path from 'path';
import replace from 'replace';
import task from './lib/task';
import copy from './lib/copy';
import watch from './lib/watch';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
export default task('copy', async () => {
  await Promise.all([
    copy('src/public', 'build/public'),
    copy('package.json', 'build/package.json'),
  ]);

  replace({
    regex: '"start".*',
    replacement: '"start": "node server.js"',
    paths: ['build/package.json'],
    recursive: false,
    silent: false,
  });

  if (global.WATCH) {
    const watcher = await watch('src/public/**/*.*');
    watcher.on('changed', async (file) => {
      const relPath = file.substr(path.join(__dirname, '../src/public/').length);
      await copy(`src/public/${relPath}`, `build/public/${relPath}`);
    });
  }
});
