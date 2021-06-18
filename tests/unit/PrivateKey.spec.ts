import { EOL } from 'os';
import { PrivateKey } from '../../src/PrivateKey';
import { AlgoSign } from '../../src/internal/AlgorithmSignatureEnum';
import { TestCase } from '../testcase';
import { Certificate } from '../../src/Certificate';

const createPrivateKey = (): PrivateKey => {
  const password = TestCase.fileContents('FIEL_AAA010101AAA/password.txt').trim();
  const filename = TestCase.filePath('FIEL_AAA010101AAA/private_key_protected.key.pem');
  return PrivateKey.openFile(filename, password);
};

const createCertificate = (): Certificate => {
  const filename = TestCase.filePath('FIEL_AAA010101AAA/certificate.cer');
  return Certificate.openFile(filename);
};

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
  it('PublicKeyIsTheSameAsInCertificate', () => {
    const certFile = TestCase.filePath('FIEL_AAA010101AAA/certificate.cer');
    const certificate = Certificate.openFile(certFile);
    const privateKey = createPrivateKey();
    const publicKey = privateKey.publicKey();
    expect(certificate.publicKey()).toStrictEqual(publicKey);
    expect(privateKey.publicKey()).toStrictEqual(publicKey);
  });
  it('Sign', () => {
    const privateKey = createPrivateKey();
    const sourceString = 'the quick brown fox jumps over the lazy dog';
    const signature = privateKey.sign(sourceString, AlgoSign.SHA512withRSA);
    expect(signature).not.toBeEmpty();
    const publicKey = privateKey.publicKey();
    expect(publicKey.verify(sourceString, signature, AlgoSign.SHA512withRSA)).toBeTruthy();
  });
  it.each([
    ['FIEL_AAA010101AAA/certificate.cer', true],
    ['CSD01_AAA010101AAA/certificate.cer', false],
  ])('BelongsTo', (filename: string, expectBelongsTo: boolean) => {
    const certificate = Certificate.openFile(TestCase.filePath(filename));
    const privateKey = createPrivateKey();
    expect(privateKey.belongsTo(certificate)).toBe(expectBelongsTo);
  });
});
