import primesList from "./Primes.js";
import PrimeManager from "./PrimeManager.js";

/**
 * import RSA from "./cryptoDir/RSA"
 *
 * const rsa = new RSA()
 * const SERVER_KEYS = rsa.generateKeyPair("some random string", "some random string")
 * when receiving a message, use message.publicKey to decrypt message using rsa.decryptMessage(message.message,message.publicKey)
 * when sending messages send {message:encryptedMessage, key:SERVER_KEYS.publicKey} encrpytedMessage = rsa.encryptMessage(message,SERVER_KEYS.privateKey)
 *
 */

/**
 * RSA Encryption/Decryption class.
 * @param {Object} options - Optional configuration object.
 * @param {PrimeManager} options.primeManager - PrimeManager instance (optional).
 */
export default class RSA {
  constructor({ primeManager = new PrimeManager(primesList) } = {}) {
    this.primeManager = primeManager;
  }

  /**
   * Generates an RSA key pair.
   * @param {string} input1 - First input string used to generate primes.
   * @param {string} input2 - Second input string used to generate primes.
   * @returns {Object} An object containing the generated public and private keys.
   */
  generateKeyPair = (input1, input2) => {
    const { prime1, prime2 } = this.generatePrimesFromInput(input1, input2);
    return this.keyPairgeneratorRSA(prime1, prime2);
  };

  /**
   * Encrypts a message using the provided encryption key.
   * @param {string} message - The message to be encrypted.
   * @param {Object} encryptionKey - The encryption key (public key) object.
   * @param {number} encryptionKey.key - The encryption key.
   * @param {number} encryptionKey.base - The base value for encryption.
   * @returns {Array} An array of encrypted message characters (numbers).
   */
  encryptMessage = (message, encryptionKey) => {
    const msgCharList = message.split("");
    const encodedMessage = msgCharList.map((character) => {
      return Number(
        BigInt(character.charCodeAt()) ** BigInt(encryptionKey.key) %
          BigInt(encryptionKey.base)
      );
    });
    return encodedMessage;
  };


  /**
   * Decrypts a cipher using the provided decryption key.
   * @param {Array} cipher - The encrypted cipher to be decrypted.
   * @param {Object} decryptionKey - The decryption key (private key) object.
   * @param {number} decryptionKey.key - The decryption key.
   * @param {number} decryptionKey.base - The base value for decryption.
   * @returns {string} The decrypted message.
   */
  decryptMessage = (cipher, decryptionKey) => {
    const message = cipher.map((character) => {
      
      return String.fromCharCode(
        Number(
          BigInt(character) ** BigInt(decryptionKey.key) %
            BigInt(decryptionKey.base)
        )
      );
    });
    return message.join("");
  };

  /////////////////////////////////

  /**
   * Sums the character codes of a string.
   * @param {string} characters - The input string.
   * @returns {number} The sum of character codes.
   */
  sumCharacterCodes = (characters) => {
    const codeList = characters.split("");
    const total = codeList.reduce((prev, curr) => {
      return (prev += curr.charCodeAt());
    }, 0);
    return total;
  };

  /**
   * Generates prime numbers from two input strings.
   * @param {string} input1 - First input string.
   * @param {string} input2 - Second input string.
   * @returns {Object} An object containing the generated prime numbers.
   */
  generatePrimesFromInput = (input1, input2) => {
    return this.primeManager.generatePrimePair(
      this.sumCharacterCodes(input1),
      this.sumCharacterCodes(input2)
    );
  };

  /**
   * Generates an RSA key pair based on the provided prime numbers.
   * @param {number} prime1 - The first prime number.
   * @param {number} prime2 - The second prime number.
   * @returns {Object} An object containing the generated public and private keys.
   */
  keyPairgeneratorRSA = (prime1, prime2) => {
    /**
     * N = product of prime1 and prime2
     * T = product of prime1 - 1 and prime2 - 1
     * e is a number between 2 and T-1 that is not a multiple of N or T
     * d is a number between 2 and T/12
     */
    let N = prime1 * prime2;
    let T = (prime1 - 1) * (prime2 - 1);
    for (let e = 2; e < T; e++) {
      if (N % e == 0 || T % e == 0) continue;
      for (let d = 2; d < T / 12; d++) {
        if ((d * e) % T == 1 && e != d && d < 500000) {
          return {
            publicKey: { key: e, base: N },
            privateKey: { key: d, base: N },
          };
        }
      }
    }
  };
}
