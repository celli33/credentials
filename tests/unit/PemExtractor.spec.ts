import { EOL } from 'os';
import { PemExtractor } from '../../src/PemExtractor';
import { TestCase } from '../testcase';

describe('PemExtractor', () => {
  it('ExtractorWithEmptyContent', () => {
    const extractor = new PemExtractor('');
    expect(extractor.getContents()).toBe('');
    expect(extractor.extractCertificate()).toBe('');
    expect(extractor.extractPublicKey()).toBe('');
  });
  it.each([
    ['CRLF', '\r\n'],
    ['LF', '\n'],
  ])('ExtractorWithFakeContent %s', (msg: string, eol: string) => {
    const content = [
      '-----BEGIN OTHER SECTION-----',
      'OTHER SECTION',
      '-----END OTHER SECTION-----',
      '-----BEGIN CERTIFICATE-----',
      'FOO+CERTIFICATE',
      '-----END CERTIFICATE-----',
      '-----BEGIN PUBLIC KEY-----',
      'FOO+PUBLIC+KEY',
      '-----END PUBLIC KEY-----',
      '-----BEGIN PRIVATE KEY-----',
      'FOO+PRIVATE+KEY',
      '-----END PRIVATE KEY-----',
    ].join(eol);
    const extractor = new PemExtractor(content);
    expect(extractor.getContents()).toBe(content);
    expect(extractor.extractCertificate()).toContain('FOO+CERTIFICATE');
    expect(extractor.extractPublicKey()).toContain('FOO+PUBLIC+KEY');
    expect(extractor.extractPrivateKey()).toContain('FOO+PRIVATE+KEY');
  });
  it('ExtractCertificateWithPublicKey', () => {
    const contents = TestCase.fileContents('CSD01_AAA010101AAA/certificate_public_key.pem');
    const extractor = new PemExtractor(contents);
    expect(extractor.getContents()).toBe(contents);
    expect(extractor.extractPublicKey()).toContain('PUBLIC KEY');
    expect(extractor.extractCertificate()).toContain('CERTIFICATE');
  });
  it('ExtractPrivateKey', () => {
    const contents = TestCase.fileContents('CSD01_AAA010101AAA/private_key.key.pem');
    const extractor = new PemExtractor(contents);
    expect(extractor.extractPrivateKey()).toContain('PRIVATE KEY');
  });
  it('UsingBinaryFileExtractNothing', () => {
    const contents = TestCase.fileContents('CSD01_AAA010101AAA/private_key.key');
    const extractor = new PemExtractor(contents);
    expect(extractor.extractCertificate()).toBe('');
    expect(extractor.extractPublicKey()).toBe('');
    expect(extractor.extractPrivateKey()).toBe('');
  });
  it('UsingAllInOnePemContents', () => {
    const contents = TestCase.fileContents('CSD01_AAA010101AAA/all_in_one.pem');
    const extractor = new PemExtractor(contents);
    expect(extractor.extractPrivateKey()).toContain('PRIVATE KEY');
    expect(extractor.extractCertificate()).toContain('CERTIFICATE');
  });
  it('ExtractRsaPrivateKeyWithoutHeaders', () => {
    const contents = ['-----BEGIN RSA PRIVATE KEY-----', 'FOO+RSA+PRIVATE+KEY', '-----END RSA PRIVATE KEY-----'].join(
      EOL,
    );
    const extractor = new PemExtractor(contents);
    expect(extractor.extractPrivateKey()).toContain('FOO+RSA+PRIVATE+KEY');
  });
});
