import { EOL } from 'os';
import { PrivateKey } from '../../src/PrivateKey';
import { AlgoSign } from '../../src/internal/AlgorithmSignatureEnum';
import { TestCase } from '../testcase';

function createPrivateKey(): PrivateKey {
  const password = TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim();
  const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
  return PrivateKey.openFile(filename, password);
}

describe('PrivateKey', () => {
  it('PemAndPassPhraseProperties', () => {
    const passPhrase = TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim();
    const fileContents = TestCase.fileContents('FIEL_AAA010101AAA/private_key_protected.key.pem');
    const privateKey = new PrivateKey(fileContents, passPhrase);
    expect(privateKey.pem()).toInclude(fileContents);
    expect(privateKey.pem()).toStartWith('-----BEGIN RSA PRIVATE KEY-----');
    expect(privateKey.pem()).toEndWith('-----END RSA PRIVATE KEY-----' + EOL);
    expect(privateKey.passPhrase()).toBe(passPhrase);
  });
});
