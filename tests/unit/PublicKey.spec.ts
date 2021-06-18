import { EOL } from 'os';
import { PublicKey } from '../../src/PublicKey';
import { PrivateKey } from '../../src/PrivateKey';
import { AlgoSign } from '../../src/internal/AlgorithmSignatureEnum';
import { TestCase } from '../testcase';

describe('PublicKey', () => {
  it('CreatePublicKeyFromCertificate', () => {
    const contents = TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer.pem');
    const publicKey = new PublicKey(contents);
    expect(publicKey.numberOfBits()).toBeGreaterThan(0);
  });
  it('OpenFile', () => {
    const publicKey = PublicKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/public_key.pem'));
    expect(publicKey.numberOfBits()).toBeGreaterThan(0);
  });
  it('CreatePublicKeyWithInvalidData', () => {
    const contents = 'invalid data';
    expect.assertions(1);
    try {
      new PublicKey(contents);
    } catch (e) {
      expect(e.message).toContain('Cannot open public key');
    }
  });
  it('Verify', () => {
    const privateKey = PrivateKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/private_key.key.pem'), '');
    const sourceString = 'The quick brown fox jumps over the lazy dog';
    const signature = privateKey.sign(sourceString);
    expect(signature.length).toBeGreaterThan(0);
    const publicKey = PublicKey.openFile(TestCase.filePath('CSD01_AAA010101AAA/public_key.pem'));
    expect(publicKey.verify(sourceString, signature)).toBeTruthy();
    expect(publicKey.verify(`${sourceString}${EOL}`, signature)).toBeFalsy();
    expect(publicKey.verify(sourceString, signature, AlgoSign.SHA512withRSA)).toBeFalsy();
  });
});
