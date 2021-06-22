import { DateTime } from 'luxon';
import { Certificate } from '../../src/Certificate';
import { SatTypeEnum } from '../../src/internal/SatTypeEnum';
import { TestCase } from '../testcase';

const createCertificate = (): Certificate => {
  return new Certificate(TestCase.fileContents('FIEL_AAA010101AAA/certificate.cer'));
};

const createCertificateSello = (): Certificate => {
  return new Certificate(TestCase.fileContents('CSD01_AAA010101AAA/certificate.cer'));
};

describe('Certificate', () => {
  it('PemContents', () => {
    const certificate = createCertificateSello();
    const expected = TestCase.fileContents('CSD01_AAA010101AAA/certificate.cer.pem');
    expect(certificate.pem()).toBe(expected);
  });
  it('SerialNumber', () => {
    const certificate = createCertificate();
    const serial = certificate.serialNumber();
    expect(serial.bytes()).toBe('30001000000300023685');
    expect(serial).toBe(certificate.serialNumber());
  });
  it('ValidDates', () => {
    const validSince = DateTime.fromISO('2017-05-16T23:29:17Z');
    const validUntil = DateTime.fromISO('2021-05-15T23:29:17Z');
    const certificate = createCertificate();
    expect(certificate.validFromDateTime()).toStrictEqual(validSince);
    expect(certificate.validToDateTime()).toStrictEqual(validUntil);
    expect(certificate.validOn(validSince.minus({ second: 1 }))).toBeFalsy();
    expect(certificate.validOn(validSince)).toBeTruthy();
    expect(certificate.validOn(validUntil)).toBeTruthy();
    expect(certificate.validOn(validUntil.plus({ second: 1 }))).toBeFalsy();
  });
  it('ValidOnWithoutDate', () => {
    const certificate = createCertificate();
    const now = DateTime.now();
    const expected = now.toMillis() <= certificate.validToDateTime().toMillis();
    expect(certificate.validOn()).toBe(expected);
  });
  it('Rfc', () => {
    expect(createCertificate().rfc()).toBe('AAA010101AAA');
  });
  it('LegalName', () => {
    expect(createCertificate().legalName()).toBe('ACCEM SERVICIOS EMPRESARIALES SC');
  });
  it('SatTypeEfirma', () => {
    expect(createCertificate().satType()).toBe(SatTypeEnum.FIEL);
  });
  it('SatTypeSello', () => {
    expect(createCertificateSello().satType()).toBe(SatTypeEnum.CSD);
  });
  it('IssuerData', () => {
    const certificate = createCertificate();
    expect(certificate.issuerData('uniqueIdentifier')).toBe('SAT970701NN3');
  });
  it('PublicKey', () => {
    const certificate = createCertificate();
    const first = certificate.publicKey();
    expect(certificate.publicKey()).toBe(first);
  });
  it('Parsed', () => {
    const certificate = createCertificate();
    const parsed = certificate.parsed();
    const expected = (parsed.subject as Record<string, unknown>).str;
    expect(expected).not.toBeNull();
    expect(certificate.name()).toBe(expected);
  });
  it('Hash', () => {
    const certificate = createCertificate();
    expect(certificate.fingerPrint()).toContain('3d2d560e90dcc3f75c46f30c2850cf9fb0640ccb');
  });
  it('Version', () => {
    const certificate = createCertificate();
    expect(certificate.version()).toBe('3');
  });
  it('ValidFromTo', () => {
    const certificate = createCertificate();
    expect(certificate.validFrom()).toMatch(/\d+z/gi);
    expect(certificate.validTo()).toMatch(/\d+z/gi);
  });
  it('ExtensionsIsNotEmpty', () => {
    const certificate = createCertificate();
    expect(certificate.extensions()).not.toBeEmpty();
  });
  it('Signature', () => {
    const certificate = createCertificate();
    expect(certificate.signatureTypeLN()).not.toBeEmpty();
  });
});
