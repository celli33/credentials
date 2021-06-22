import { KEYUTIL, RSAKey, KJUR } from 'jsrsasign';
import { use } from 'typescript-mix';
import { AlgoSign } from './internal/AlgorithmSignatureEnum';
import { DSAKeyObject, Key, RSAKeyObject } from './internal/Key';
import { KeyEnumType } from './internal/KeyEnumType';
import { LocalFileOpen } from './internal/LocalFileOpen';

export interface PublicKey extends Key, LocalFileOpen {}
export class PublicKey {
  @use(Key, LocalFileOpen) this;

  constructor(source: string) {
    const dataObj = PublicKey.callOnPublicKeyWithContents((pubKey: any) => {
      const pem = KEYUTIL.getPEM(pubKey);
      const data: Record<string, unknown> = {};
      if (pubKey instanceof RSAKey) {
        const bits = (pubKey as unknown as RSAKeyObject).n.bitLength();
        data['bits'] = bits;
        data['key'] = pem;
        data[KeyEnumType.KEYTYPE_RSA] = pubKey;
        data['type'] = KeyEnumType.KEYTYPE_RSA;
      } else if (pubKey instanceof KJUR.crypto.DSA) {
        const bits = (pubKey as unknown as DSAKeyObject).p.bitLength();
        data['bits'] = bits;
        data['key'] = pem;
        data[KeyEnumType.KEYTYPE_DSA] = pubKey;
        data['type'] = KeyEnumType.KEYTYPE_DSA;
      } else {
        throw new Error('Cannot open public key');
      }
      return data;
    }, source);
    this.data = dataObj;
  }

  public static openFile(filename: string): PublicKey {
    return new PublicKey(LocalFileOpen.localFileOpen(filename));
  }

  public verify(data: string, signature: string, algorithm = AlgoSign.SHA256withRSA): boolean {
    return this.callOnPublicKey((publicKey: any) => {
      try {
        return this.signVerify(data, signature, publicKey, algorithm);
      } catch (e) {
        throw new Error('Verify error: ' + e.message);
      }
    });
  }

  protected signVerify(
    data: string,
    signature: string,
    publicKey: string,
    algorithm = AlgoSign.SHA256withRSA,
  ): boolean {
    let ver = new KJUR.crypto.Signature({ alg: algorithm });
    ver.init(publicKey);
    ver.updateString(data);
    return ver.verify(signature); // return true
  }

  public callOnPublicKey(myFunc: Function) {
    return PublicKey.callOnPublicKeyWithContents(myFunc, this.publicKeyContents());
  }

  private static callOnPublicKeyWithContents(myFunc: Function, publicKeyContents: string) {
    let pubKey = null;
    let error = '';
    try {
      pubKey = KEYUTIL.getKey(publicKeyContents);
    } catch (e) {
      error = e.message;
    }
    if (!pubKey) {
      throw new Error('Cannot open public key: ' + error);
    }
    return myFunc(pubKey);
  }
}
