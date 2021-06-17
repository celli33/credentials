import { Key } from './internal/Key';
import { LocalFileOpen } from './internal/LocalFileOpen';

export class PublicKey extends Key implements LocalFileOpen {
  // constructor() {
  //   super();
  // }
  // private static callOnPublicKeyWithContents(Closure: Function, publicKeyContents: string){
  // }
  // /**
  //    * @param Closure $function
  //    * @param string $publicKeyContents
  //    * @return mixed
  //    * @throws RuntimeException when Cannot open public key
  //    */
  //   private static function callOnPublicKeyWithContents(Closure $function, string $publicKeyContents)
  //   {
  //       $pubKey = openssl_get_publickey($publicKeyContents);
  //       if (false === $pubKey) {
  //           throw new RuntimeException('Cannot open public key: ' . openssl_error_string());
  //       }
  //       try {
  //           return call_user_func($function, $pubKey);
  //       } finally {
  //           if (PHP_VERSION_ID < 80000) {
  //               openssl_free_key($pubKey);
  //           }
  //       }
  //   }
}
