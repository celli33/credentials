import { DataMixin } from './DataMixin';

export class Key extends DataMixin {
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

  // public function type(): OpenSslKeyTypeEnum
  // {
  //     if (null === $this->type) {
  //         $this->type = new OpenSslKeyTypeEnum($this->extractInteger('type'));
  //     }
  //     return $this->type;
  // }

  // /** @return array<mixed> */
  // public function typeData(): array
  // {
  //     return $this->extractArray($this->type()->value());
  // }

  // /**
  //  * @param int $type one of OPENSSL_KEYTYPE_RSA, OPENSSL_KEYTYPE_DSA, OPENSSL_KEYTYPE_DH, OPENSSL_KEYTYPE_EC
  //  * @return bool
  //  */
  // public function isType(int $type): bool
  // {
  //     return ($this->type()->index() === $type);
  // }
}
