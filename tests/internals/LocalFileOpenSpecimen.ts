import { LocalFileOpen } from '../../src/internal/LocalFileOpen';

export class LocalFileOpenSpecimen extends LocalFileOpen {
  public localFileOpen(filename: string): string {
    return LocalFileOpen.localFileOpen(filename);
  }
}
