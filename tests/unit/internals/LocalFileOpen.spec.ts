import { TestCase } from '../../testcase';
import { LocalFileOpenSpecimen } from './LocalFileOpenSpecimen';

describe('LocalFileOpen', () => {
  it('OpenWithFlatPath', () => {
    const filename = TestCase.filePath('FIEL_AAA010101AAA/password.txt');
    const specimen = new LocalFileOpenSpecimen();
    const expected = TestCase.fileContents('FIEL_AAA010101AAA/password.txt');
    expect(specimen.localFileOpen(filename)).toEqual(expected);
  });
  it('OpenWithFileSchemeOnPath', () => {
    const filename = `file://${TestCase.filePath('FIEL_AAA010101AAA/password.txt')}`;
    const specimen = new LocalFileOpenSpecimen();
    const expected = TestCase.fileContents('FIEL_AAA010101AAA/password.txt');
    expect(specimen.localFileOpen(filename)).toEqual(expected);
  });
  it('OpenWithDirectory', () => {
    const filename = __dirname;
    const specimen = new LocalFileOpenSpecimen();
    expect.assertions(1);
    try {
      specimen.localFileOpen(filename);
    } catch (e) {
      expect(e.message).toBe('EISDIR: illegal operation on a directory, read');
    }
  });
  it('OpenWithNonExistentPath', () => {
    const filename = `${__dirname}/nonexistent`;
    const specimen = new LocalFileOpenSpecimen();
    expect.assertions(1);
    try {
      specimen.localFileOpen(filename);
    } catch (e) {
      expect(e.message).toBe('Unable to locate the file to open');
    }
  });
});
