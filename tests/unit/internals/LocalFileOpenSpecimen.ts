import { use } from 'typescript-mix';
import { LocalFileOpen } from '../../../src/internal/LocalFileOpen';

export interface LocalFileOpenSpecimen extends LocalFileOpen {}
export class LocalFileOpenSpecimen {
  @use(LocalFileOpen) this;

  public localFileOpen(filename: string): string {
    return LocalFileOpen.localFileOpen(filename);
  }
}
