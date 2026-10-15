import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

// Local MP4 files remain available to editors, while production ships HLS only.
const directories = ['nj', 'toposh', 'skills-ui', 'story'];
await Promise.all(directories.map(directory => rm(resolve('dist', 'videos', directory), { recursive: true, force: true })));
