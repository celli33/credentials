import { Credential } from '../../src/Credential';
import { Certificate } from '../../src/Certificate';
import { PrivateKey } from '../../src/PrivateKey';
import { TestCase } from '../testcase';

describe('Credential', () => {
  it('CreateWithMatchingValues', () => {
    const certificate = Certificate.openFile(TestCase.filePath('FIEL_AAA010101AAA/certificate.cer'));
    const privateKey = PrivateKey.openFile(TestCase.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');
    const fiel = new Credential(certificate, privateKey);
    expect(fiel.certificate()).toBe(certificate);
    expect(fiel.privateKey()).toBe(privateKey);
  });
  it('CreateWithUnmatchedValues', () => {
    const certificate = Certificate.openFile(TestCase.filePath('CSD01_AAA010101AAA/certificate.cer'));
    const privateKey = PrivateKey.openFile(TestCase.filePath('FIEL_AAA010101AAA/private_key.key.pem'), '');
    expect.assertions(1);
    try {
      new Credential(certificate, privateKey);
    } catch (e) {
      expect(e.message).toBe('Certificate does not belong to private key');
    }
  });
  it('CreateWithFiles', () => {
    const fiel = Credential.openFiles(
      TestCase.filePath('FIEL_AAA010101AAA/certificate.cer'),
      TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem'),
      TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim(),
    );
    expect(fiel.isFiel()).toBeTruthy();
  });
  it('CreateCredentialWithContents', () => {
    const fiel = Credential.create(
      TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer'),
      TestCase.fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem'),
      TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim(),
    );
    expect(fiel.isFiel()).toBeTruthy();
  });
  it('ShortCuts', () => {
    const credential = Credential.openFiles(
      TestCase.filePath('CSD01_AAA010101AAA/certificate.cer'),
      TestCase.filePath('CSD01_AAA010101AAA/private_key_protected.key.pem'),
      TestCase.fileContents('CSD01_AAA010101AAA/password.txt').trim(),
    );
    expect(credential.isCsd()).toBeTruthy();
    expect(credential.isFiel()).toBeFalsy();
    const textToSign = 'The quick brown fox jumps over the lazy dog';
    const signature = credential.sign(textToSign);
    expect(signature).not.toBeEmpty();
    expect(credential.verify(textToSign, signature)).toBeTruthy();
  });
});
