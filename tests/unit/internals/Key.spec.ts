import { Key } from '../../../src/internal/Key';

describe('Key', () => {
  it('AccessorsUsingFakeKeyData', () => {
    const data = {
      bits: 512,
      key: 'x-key',
      rsa: [{ x: 'foo' }],
    };
    const key = new Key(data);
    expect(key.parsed()).toStrictEqual(data);
    expect(key.numberOfBits()).toBe(512);
    expect(key.publicKeyContents()).toBe('x-key');
  });
});
