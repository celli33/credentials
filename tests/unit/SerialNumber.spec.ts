import { SerialNumber } from '../../src/SerialNumber';

describe('SerialNumber', () => {
  const SERIAL_HEXADECIMAL = '3330303031303030303030333030303233373038';
  const SERIAL_BYTES = '30001000000300023708';
  const SERIAL_DECIMAL = '292233162870206001759766198425879490508935868472';
  it.each([[''], ['0X'], ['0x']])('CreateFromHexadecimal', (prefix: string) => {
    const value = `${prefix}${SERIAL_HEXADECIMAL}`;
    const serial = SerialNumber.createFromHexadecimal(value);
    expect(serial.hexadecimal()).toBe(SERIAL_HEXADECIMAL);
    expect(serial.decimal()).toBe(SERIAL_DECIMAL);
    expect(serial.bytes()).toBe(SERIAL_BYTES);
  });
  it('CreateHexadecimalEmpty', () => {
    expect.assertions(1);
    try {
      SerialNumber.createFromHexadecimal('');
    } catch (e) {
      expect(e.message).toBe('The hexadecimal string is empty');
    }
  });
  it('CreateHexadecimalInvalidChars', () => {
    expect.assertions(1);
    try {
      SerialNumber.createFromHexadecimal('0x001122x3');
    } catch (e) {
      expect(e.message).toBe('The hexadecimal string contains invalid characters');
    }
  });
  it('CreateHexadecimalDoublePrefix', () => {
    expect.assertions(1);
    try {
      SerialNumber.createFromHexadecimal('0x0xFF');
    } catch (e) {
      expect(e.message).toBe('The hexadecimal string contains invalid characters');
    }
  });
  it('CreateFromDecimal', () => {
    const serial = SerialNumber.createFromDecimal(SERIAL_DECIMAL);
    expect(serial.bytes()).toBe(SERIAL_BYTES);
  });
  it('CreateFromBytes', () => {
    const serial = SerialNumber.createFromBytes(SERIAL_BYTES);
    expect(serial.hexadecimal()).toBe(SERIAL_HEXADECIMAL);
  });
});
