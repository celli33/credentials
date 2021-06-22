import { KJUR, rstrtohex, X509, zulutodate } from 'jsrsasign';
import { DateTime } from 'luxon';
import { use } from 'typescript-mix';
import { DataMixin } from './internal/DataMixin';
import { LocalFileOpen } from './internal/LocalFileOpen';
import { SatTypeEnum } from './internal/SatTypeEnum';
import { PemExtractor } from './PemExtractor';
import { PublicKey } from './PublicKey';
import { SerialNumber } from './SerialNumber';

interface RDN {
  type: string;
  value: string;
  ds?: string;
}

interface X500NameArray extends Array<Array<RDN>> {}

export interface Certificate extends DataMixin, LocalFileOpen {}

export class Certificate {
  @use(DataMixin, LocalFileOpen) this;

  private pemVar: string;
  private rfcVar: string;
  private legalNameVar: string;
  private serialNumberVar?: SerialNumber;
  private publicKeyVar?: PublicKey;
  private rawCert: X509;

  constructor(contents: string) {
    if ('' === contents) {
      throw new Error('Create certificate from empty contents');
    }
    let pem = new PemExtractor(contents).extractCertificate();
    if ('' === pem) {
      pem = Certificate.convertDerToPem(contents);
    }
    const x = new X509();
    try {
      x.readCertPEM(pem);
    } catch (e) {
      throw new Error('Cannot parse X509 certificate from contents');
    }
    this.pemVar = pem;
    this.data = (x as unknown as { getParam(): Record<string, unknown> }).getParam();
    this.rfcVar = this.subjectData('uniqueIdentifier').split(" ")[0] || '';
    this.legalNameVar = this.subjectData('2.5.4.41');
    this.rawCert = x;
  }

  private findValueOnX500Array(subjectArray: X500NameArray, target: string): string {
    const RDN = subjectArray.find((x) => {
      return x.find((rdn) => rdn.type === target);
    });
    if (RDN) {
      return RDN.find((rdn) => rdn.type === target).value;
    }
    return '';
  }

  public static convertDerToPem(contents: string): string {
    const hexDerFileContents = rstrtohex(contents);
    return new PemExtractor(
      KJUR.asn1.ASN1Util.getPEMStringFromHex(hexDerFileContents, 'CERTIFICATE'),
    ).extractCertificate();
  }

  public static openFile(filename: string): Certificate {
    return new Certificate(LocalFileOpen.localFileOpen(filename));
  }

  public pem(): string {
    return this.pemVar;
  }

  public pemAsOneLine(): string {
    const arr = this.pem().split('\n');
    const arrFixed = arr.filter((x) => /^((?!-).)*$/.test(x));
    return arrFixed.join('');
  }

  public parsed(): Record<string, unknown> {
    return this.data;
  }

  public rfc(): string {
    return this.rfcVar;
  }

  public legalName(): string {
    return this.legalNameVar;
  }

  public branchName(): string {
    return this.subjectData('OU');
  }

  public name(): string {
    return `${this.extractObject('subject').str}`;
  }

  public subject(): X500NameArray {
    return this.extractObject('subject').array as X500NameArray;
  }

  public subjectData(key: string): string {
    return this.findValueOnX500Array(this.subject(), key);
  }

  public fingerPrint(): string {
    return KJUR.crypto.Util.hashHex(this.rawCert.hex, 'sha1');
  }

  public issuer(): X500NameArray {
    return this.extractObject('issuer').array as X500NameArray;
  }

  public issuerData(key: string): string {
    return this.findValueOnX500Array(this.issuer(), key);
  }

  public version(): string {
    return this.extractString('version');
  }

  public serialNumber(): SerialNumber {
    if (!this.serialNumberVar) {
      const serialObj = this.extractObject('serial');
      this.serialNumberVar = this.createSerialNumber((serialObj.hex as string) || '', (serialObj.str as string) || '');
    }
    return this.serialNumberVar;
  }

  public validFrom(): string {
    return this.extractString('notbefore');
  }

  public validTo(): string {
    return this.extractString('notafter');
  }

  public validFromDateTime(): DateTime {
    return DateTime.fromJSDate(zulutodate(this.validFrom()));
  }

  public validToDateTime(): DateTime {
    return DateTime.fromJSDate(zulutodate(this.validTo()));
  }

  public signatureTypeLN(): string {
    return this.rawCert.getSignatureAlgorithmName();
  }

  public extensions(): Array<Record<string, unknown>> {
    return this.extractArray('ext') as Array<Record<string, unknown>>;
  }

  public publicKey(): PublicKey {
    if (!this.publicKeyVar) {
      // The public key can be created from PUBLIC KEY or CERTIFICATE
      this.publicKeyVar = new PublicKey(this.extractString('sbjpubkey'));
    }
    return this.publicKeyVar;
  }

  public satType(): string {
    // as of 2019-08-01 is known that only CSD have OU (Organization Unit)
    if ('' === this.branchName()) {
      return SatTypeEnum.FIEL;
    }
    return SatTypeEnum.CSD;
  }

  public validOn(datetime: DateTime | null = null): boolean {
    if (null === datetime) {
      datetime = DateTime.now();
    }
    return (
      datetime.toMillis() >= this.validFromDateTime().toMillis() &&
      datetime.toMillis() <= this.validToDateTime().toMillis()
    );
  }

  protected createSerialNumber(hexadecimal: string, decimal: string): SerialNumber {
    if ('' !== hexadecimal) {
      return SerialNumber.createFromHexadecimal(hexadecimal);
    }
    if ('' !== decimal) {
      // in some cases openssl report serialNumberHex on serialNumber
      if (KJUR.lang.String.isHex(decimal)) {
        return SerialNumber.createFromHexadecimal(decimal.slice(2));
      }
      return SerialNumber.createFromDecimal(decimal);
    }
    throw new Error('Certificate does not contain a serial number');
  }
}
