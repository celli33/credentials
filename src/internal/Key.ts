import { use } from 'typescript-mix';
import { BigInteger } from 'jsrsasign';
import { DataMixin } from './DataMixin';
import { KeyEnumType } from './KeyEnumType';

export interface RSAKeyObject {
  n: BigInteger;
  e: unknown;
  d: unknown;
  p: unknown;
  q: unknown;
  dmp1: unknown;
  dmq1: unknown;
  coeff: unknown;
  isPublic: boolean;
  isPrivate: boolean;
}

export interface Key extends DataMixin {}
export class Key {
  @use(DataMixin) this;

  private typeKey: string;

  constructor(data: Record<string, unknown>) {
    this.data = data;
  }

  public parsed(): Record<string, unknown> {
    return this.data;
  }

  public publicKeyContents(): string {
    return this.extractString('key');
  }

  public numberOfBits(): number {
    return this.extractInteger('bits');
  }

  get type(): string {
    if (!this.typeKey) {
      this.typeKey = this.extractString('type');
    }
    return this.typeKey;
  }

  public typeData(): Record<string, unknown> {
    return this.extractObject(this.typeKey);
  }

  public isType(type: string): boolean {
    return this.type === type;
  }

  public isRSA(): boolean {
    return this.type === KeyEnumType.KEYTYPE_RSA;
  }

  public isDSA(): boolean {
    return this.type === KeyEnumType.KEYTYPE_DSA;
  }

  public isECDSA(): boolean {
    return this.type === KeyEnumType.KEYTYPE_ECDSA;
  }
}
