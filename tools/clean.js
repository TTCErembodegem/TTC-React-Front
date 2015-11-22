import del from 'del';
import task from './lib/task';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
export default task('clean', async () => {
  await del(['.tmp', 'build/*', '!build/.git'], {dot: true});
  await fs.makeDir('build/public');
});
