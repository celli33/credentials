import { DataMixin } from './DataMixin';
import { KeyEnumType } from './KeyEnumType';

export class Key extends DataMixin {
  private typeKey: string;

  constructor(data: Record<string, unknown>) {
    super();
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
