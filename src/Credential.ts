import { Certificate } from './Certificate';
import { AlgoSign } from './internal/AlgorithmSignatureEnum';
import { SatTypeEnum } from './internal/SatTypeEnum';
import { PrivateKey } from './PrivateKey';

export class Credential {
  private certificateV: Certificate;
  private privateKeyV: PrivateKey;

  constructor(certificate: Certificate, privateKey: PrivateKey) {
    if (!privateKey.belongsTo(certificate)) {
      throw new Error('Certificate does not belong to private key');
    }
    this.certificateV = certificate;
    this.privateKeyV = privateKey;
  }

  public static create(certificateContents: string, privateKeyContents: string, passPhrase: string): Credential {
    const certificate = new Certificate(certificateContents);
    const privateKey = new PrivateKey(privateKeyContents, passPhrase);
    return new Credential(certificate, privateKey);
  }

  public static openFiles(certificateFile: string, privateKeyFile: string, passPhrase: string): Credential {
    const certificate = Certificate.openFile(certificateFile);
    const privateKey = PrivateKey.openFile(privateKeyFile, passPhrase);
    return new Credential(certificate, privateKey);
  }

  public certificate(): Certificate {
    return this.certificateV;
  }

  public privateKey(): PrivateKey {
    return this.privateKeyV;
  }

  public rfc(): string {
    return this.certificate().rfc();
  }

  public legalName(): string {
    return this.certificate().legalName();
  }

  public isFiel(): boolean {
    return this.certificate().satType() === SatTypeEnum.FIEL;
  }

  public isCsd(): boolean {
    return this.certificate().satType() === SatTypeEnum.CSD;
  }

  public sign(data: string, algorithm = AlgoSign.SHA256withRSA): string {
    return this.privateKey().sign(data, algorithm);
  }

  public verify(data: string, signature: string, algorithm = AlgoSign.SHA256withRSA): boolean {
    return this.certificate().publicKey().verify(data, signature, algorithm);
  }
}
