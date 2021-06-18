import * as rsu from 'jsrsasign-util';
import { realpathSync } from 'fs';

export class LocalFileOpen {
  static localFileOpen(filename: string) {
    if ('file://' === filename.substr(0, 7)) {
      filename = filename.substr(7);
    }

    if ('' === filename) {
      throw new Error('The file to open is empty');
    }
    let path = '';
    try {
      path = realpathSync(filename) || '';
    } catch (e) {}

    if ('' === path) {
      throw new Error('Unable to locate the file to open');
    }

    const contents = rsu.readFile(path);
    if ('' === contents) {
      throw new Error('File content is empty');
    }
    return contents;
  }
}
