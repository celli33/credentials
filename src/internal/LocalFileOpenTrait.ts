import { realpathSync, readFileSync } from 'fs';

type Ctor = new (...a: any[]) => any;

export function LocalFileOpenMixin<Super extends Ctor>(
  superClass: Super,
): {
  new (...a: any[]);
} & Super {
  class LocalFileOpenTrait extends superClass {
    localFileOpen(filename: string) {
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

      const contents = readFileSync(path).toString();
      if ('' === contents) {
        throw new Error('File content is empty');
      }
      return contents;
    }
  }
  return LocalFileOpenTrait;
}
