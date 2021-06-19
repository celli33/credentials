import { PrivateKey } from '../../src/PrivateKey';
import { TestCase } from '../testcase';

describe('PrivateKeyConstructor', () => {
  it('ConstructWithValidContent', () => {
    const content = TestCase.fileContents('FIEL_AAA010101AAA/private_key.key.pem');
    const privateKey = new PrivateKey(content, '');
    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });
  it('OpenFileUnprotected', () => {
    const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key.key.pem');
    const privateKey = PrivateKey.openFile(filename, '');
    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });
  it('OpenFileWithValidPassword', () => {
    const password = TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim();
    const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
    const privateKey = PrivateKey.openFile(filename, password);
    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });
  it('OpenFileWithInvalidPassword', () => {
    const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
    expect.assertions(1);
    try {
      PrivateKey.openFile(filename, '');
    } catch (e) {
      expect(e.message).toBe('Cannot open private key: undefined');
    }
  });
  it('ConstructWithEmptyContent', () => {
    expect.assertions(1);
    try {
      new PrivateKey('', '');
    } catch (e) {
      expect(e.message).toBe('Private key is empty');
    }
  });
  it('ConstructWithInvalidContent', () => {
    expect.assertions(1);
    try {
      new PrivateKey('invalid content', '');
    } catch (e) {
      expect(e.message).toBe('Cannot open private key: malformed plain PKCS8 private key(code:001)');
    }
  });
  it('ConstructWithInvalidButBase64Content', () => {
    expect.assertions(1);
    try {
      new PrivateKey('INVALID+CONTENT', '');
    } catch (e) {
      expect(e.message).toBe('Cannot open private key: malformed plain PKCS8 private key(code:001)');
    }
  });
  it('ConstructWithPkcs8Encrypted', () => {
    const content = TestCase.fileContents('CSD01_AAA010101AAA/private_key.key');
    const password = TestCase.fileContents('CSD01_AAA010101AAA/password.txt').trim();
    const privateKey = new PrivateKey(content, password);
    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });
  it('ConstructWithPkcs8Unencrypted', () => {
    const content = TestCase.fileContents('CSD01_AAA010101AAA/private_key_plain.key');
    const privateKey = new PrivateKey(content, '');
    expect(privateKey.numberOfBits()).toBeGreaterThan(0);
  });
});
