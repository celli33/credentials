import { KEYUTIL, RSAKey, KJUR, X509, pemtohex } from 'jsrsasign';
import { KeyEnumType } from './internal/KeyEnumType';
import { use } from 'typescript-mix';
import { Key, RSAKeyObject } from './internal/Key';
import { LocalFileOpen } from './internal/LocalFileOpen';
import { PemExtractor } from './PemExtractor';
import { PublicKey } from './PublicKey';
import { AlgoSign } from './internal/AlgorithmSignatureEnum';
import { Certificate } from './Certificate';

export interface PrivateKey extends Key, LocalFileOpen {}
export class PrivateKey {
  @use(Key, LocalFileOpen) this;

  private pemVar: string;
  private passPhraseVar: string;
  private publicKeyVar: PublicKey | null;

  constructor(source: string, passPhrase: string) {
    if (source === '') {
      throw new Error('Private key is empty');
    }
    const pemExtractor = new PemExtractor(source);
    let pem = pemExtractor.extractPrivateKey();
    if (pem === '') {
      pem = source;
    }
    this.pemVar = pem;
    this.passPhraseVar = passPhrase;
    this.data = this.callOnPrivateKey((privateKey: any) => {
      const privKeyJWK = KEYUTIL.getJWKFromKey(privateKey);
      let { e, kty, n } = privKeyJWK;
      const pubKeyJWK = { e, kty, n };
      const pubKey = KEYUTIL.getKey(pubKeyJWK);
      const pubKeyPEMText = KEYUTIL.getPEM(pubKey);
      const data: Record<string, unknown> = {};
      if (privateKey instanceof RSAKey) {
        const bits = (privateKey as unknown as RSAKeyObject).n.bitLength();
        data['bits'] = bits;
        data['key'] = pubKeyPEMText;
        data[KeyEnumType.KEYTYPE_RSA] = privateKey;
        data['type'] = KeyEnumType.KEYTYPE_RSA;
      }
      return data;
    });
  }

  public static openFile(filename: string, passPhrase: string): PrivateKey {
    return new PrivateKey(LocalFileOpen.localFileOpen(filename), passPhrase);
  }

  public pem(): string {
    return this.pemVar;
  }

  public passPhrase(): string {
    return this.passPhraseVar;
  }

  public publicKey(): PublicKey {
    if (!this.publicKeyVar) {
      this.publicKeyVar = new PublicKey(this.publicKeyContents());
    }
    return this.publicKeyVar;
  }

  public sign(data: string, algorithm = AlgoSign.SHA256withRSA): string {
    return this.callOnPrivateKey((privateKey: any) => {
      try {
        let sig = new KJUR.crypto.Signature({ alg: algorithm });
        sig.init(privateKey);
        sig.updateString(data);
        const signature = sig.sign();
        if ('' === signature) {
          throw new Error('Cannot sign data: empty signature');
        }
        return signature;
      } catch (e) {
        throw new Error('Cannot sign data: empty signature');
      }
    });
  }

  public belongsTo(certificate: Certificate): boolean {
    return this.belongsToPEMCertificate(certificate.pem());
  }

  public belongsToPEMCertificate(certificate: string): boolean {
    const pubKey = KEYUTIL.getKey(this.publicKeyContents()); // or certificate
    const x = new X509();
    x.readCertPEM(certificate);
    const certPubKey = x.getPublicKey();
    return JSON.stringify(certPubKey) === JSON.stringify(pubKey);
  }

  public callOnPrivateKey(myFunc: Function) {
    let privateKey = null;
    let error = '';
    try {
      privateKey = KEYUTIL.getKey(this.pem(), this.passPhrase());
    } catch (e) {
      error = e.message;
    }
    if (!privateKey) {
      throw new Error('Cannot open private key: ' + error);
    }
    return myFunc(privateKey);
  }
}
