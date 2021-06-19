import { Certificate } from '../../src/Certificate';
import { TestCase } from '../testcase';

describe('CertificateConstructor', () => {
  it('ConstructorWithPemContent', () => {
    const pem = TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer.pem');
    const certificate = new Certificate(pem);
    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });
  it('ConstructorWithDerContent', () => {
    const contents = TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer');
    const certificate = new Certificate(contents);
    expect(certificate.serialNumber().bytes()).toBe('30001000000300023685');
  });
  it('ConstructorWithEmptyContent', () => {
    expect.assertions(1);
    try {
      new Certificate('');
    } catch (e) {
      expect(e.message).toBe('Create certificate from empty contents');
    }
  });
  it('ConstructorWithInvalidContent', () => {
    expect.assertions(1);
    try {
      new Certificate('x');
    } catch (e) {
      expect(e.message).toBe('Cannot parse X509 certificate from contents');
    }
  });
});
