import { Certificate } from './Certificate';
import { Credential } from './Credential';
import { AlgoSign } from './internal/AlgorithmSignatureEnum';
import { SatTypeEnum } from './internal/SatTypeEnum';

export { Certificate, Credential, AlgoSign, SatTypeEnum };

Object.assign(module.exports, Certificate);
Object.assign(module.exports, Credential);
Object.assign(module.exports, AlgoSign);
Object.assign(module.exports, SatTypeEnum);
