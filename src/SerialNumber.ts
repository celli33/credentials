import { BaseConverter } from '@nodecfdi/utils-internal-baseconverter';

const strcasecmp = (fString1: string, fString2: string) => {
  const string1 = (fString1 + '').toLowerCase();
  const string2 = (fString2 + '').toLowerCase();
  if (string1 > string2) {
    return 1;
  } else if (string1 === string2) {
    return 0;
  }
  return -1;
};

const str_split = (string: string, splitLength?: number) => {
  if (!splitLength) {
    splitLength = 1;
  }
  string += '';
  const chunks = [];
  let pos = 0;
  const len = string.length;
  while (pos < len) {
    chunks.push(string.slice(pos, (pos += splitLength)));
  }
  return chunks;
};

const chr = (codePt: number) => {
  if (codePt > 0xffff) {
    codePt -= 0x10000;
    return String.fromCharCode(0xd800 + (codePt >> 10), 0xdc00 + (codePt & 0x3ff));
  }
  return String.fromCharCode(codePt);
};

export class SerialNumber {
  private hexadecimalV: string;

  constructor(hexadecimal: string) {
    if ('' === hexadecimal) {
      throw new Error('The hexadecimal string is empty');
    }
    if (0 === strcasecmp('0x', hexadecimal.substr(0, 2))) {
      hexadecimal = hexadecimal.substr(2);
    }
    if (!/^[0-9a-f]*$/.test(hexadecimal)) {
      throw new Error('The hexadecimal string contains invalid characters');
    }
    this.hexadecimalV = hexadecimal;
  }

  public static createFromHexadecimal(hexadecimal: string): SerialNumber {
    return new SerialNumber(hexadecimal);
  }

  public static createFromDecimal(decString: string): SerialNumber {
    const hexadecimal = BaseConverter.createBase36().convert(decString, 10, 16);
    return new SerialNumber(hexadecimal);
  }

  public static createFromBytes(input: string): SerialNumber {
    const hexadecimal = str_split(input, 1)
      .map((value) => {
        let fixedNumber = value.charCodeAt(0);
        if (fixedNumber < 0) {
          fixedNumber = 0xffffffff + fixedNumber + 1;
        }
        return parseInt(`${fixedNumber}`, 10).toString(16);
      })
      .join('');
    return new SerialNumber(hexadecimal);
  }

  public hexadecimal(): string {
    return this.hexadecimalV;
  }

  public bytes(): string {
    return str_split(this.hexadecimalV, 2)
      .map((value: string) => {
        let fixedValue = value.replace(/[^a-f0-9]/gi, '');
        let fixedNumber = parseInt(fixedValue, 16);
        return chr(fixedNumber);
      })
      .join('');
  }

  public decimal(): string {
    return BaseConverter.createBase36().convert(this.hexadecimal(), 16, 10);
  }
}
