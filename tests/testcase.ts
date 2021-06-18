import * as rsu from 'jsrsasign-util';
import { join } from 'path';

export class TestCase {
  public static filePath(filename: string): string {
    return join(__dirname, '_files', filename);
  }

  public static fileContents(filename: string): string {
    return rsu.readFile(TestCase.filePath(filename));
  }
}
