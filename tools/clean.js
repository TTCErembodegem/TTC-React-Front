import del from 'del';
import task from './lib/task';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
export default task('clean', async () => {
  await del(['build/*', '!build/.git', '!build/release'], {dot: true});
  await fs.makeDir('build/public');
});
