import { Key } from '../../../src/internal/Key';
import { KeyEnumType } from '../../../src/internal/KeyEnumType';

describe('Key', () => {
  it('AccessorsUsingFakeKeyData', () => {
    const data = {
      bits: 512,
      key: 'x-key',
      type: KeyEnumType.KEYTYPE_RSA,
      RSA: { x: 'foo' },
    };
    const key = new Key(data);
    expect(key.parsed()).toStrictEqual(data);
    expect(key.numberOfBits()).toBe(512);
    expect(key.publicKeyContents()).toBe('x-key');
    expect(key.isRSA()).toBe(true);
    expect(key.isType(KeyEnumType.KEYTYPE_RSA)).toBe(true);
    expect(key.typeData()).toStrictEqual({ x: 'foo' });
  });
  it('UsingEmptyData', () => {
    const key = new Key({});
    expect(key.numberOfBits()).toBe(0);
    expect(key.publicKeyContents()).toBe('');
    expect(key.isRSA()).toBeFalsy();
    expect(key.isDSA()).toBeFalsy();
    expect(key.isECDSA()).toBeFalsy();
    expect(key.isType('')).toBeTruthy();
    expect(key.typeData()).toStrictEqual({});
  });
});
