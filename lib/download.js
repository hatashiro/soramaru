import request from 'request';
import {mkdir} from 'mz/fs';
import {createWriteStream} from 'fs';
import {dirname} from 'path';

async function ensureDir(path) {
  const directory = dirname(path);
  if (directory !== '.' && directory !== '/') {
    await ensureDir(directory);
  }

  try {
    await mkdir(path);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

export default async function download(url, destPath) {
  await ensureDir(dirname(destPath));
  return new Promise((resolve, reject) => {
    const writePipe = createWriteStream(destPath);
    const readPipe = request.get(url);
    readPipe.on('error', reject);
    writePipe.on('error', reject);
    writePipe.on('close', resolve);
    readPipe.pipe(writePipe);
  });
}
