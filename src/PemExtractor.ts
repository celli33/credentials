export class PemExtractor {
  private contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  public getContents(): string {
    return this.contents;
  }

  public extractCertificate(): string {
    return this.extractBase64('CERTIFICATE');
  }

  public extractPublicKey(): string {
    return this.extractBase64('PUBLIC KEY');
  }

  public extractPrivateKey(): string {
    // see https://github.com/kjur/jsrsasign/wiki/Tutorial-for-PKCS5-and-PKCS8-PEM-private-key-formats-differences
    // PKCS#8 plain private key
    let extracted = this.extractBase64('PRIVATE KEY');
    if ('' !== extracted) {
      return extracted;
    }
    // PKCS#5 plain private key
    extracted = this.extractBase64('RSA PRIVATE KEY');
    if ('' !== extracted) {
      return extracted;
    }
    // PKCS#5 encrypted private key
    extracted = this.extractRsaProtected();
    if ('' !== extracted) {
      return extracted;
    }
    // PKCS#8 encrypted private key
    return this.extractBase64('ENCRYPTED PRIVATE KEY');
  }

  protected extractBase64(type: string): string {
    type = type.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + '/' + '-]', 'g'), '\\$&');
    const pattern = `^-----BEGIN ${type}-----\r?\n([A-Za-z0-9+\/=]+\r?\n)+-----END ${type}-----\r?\n?$`;
    const matches = this.getContents().match(new RegExp(pattern, 'm'));
    return this.normalizeLineEndings(`${matches ? matches[0] : ''}`);
  }

  protected extractRsaProtected(): string {
    let pattern = `^-----BEGIN RSA PRIVATE KEY-----\r?\nProc-Type: .+\r?\nDEK-Info: .+\r?\n\r?\n([A-Za-z0-9+\/=]+\r?\n)+-----END RSA PRIVATE KEY-----\r?\n?$`;
    const matches = this.getContents().match(new RegExp(pattern, 'm'));
    return this.normalizeLineEndings(`${matches ? matches[0] : ''}`);
  }

  protected normalizeLineEndings(content: string): string {
    return content.replace(/\r\n/g, '\n');
  }
}
