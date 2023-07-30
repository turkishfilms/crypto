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
    const keys = this.keyPairgeneratorRSA2(prime1, prime2);
    console.log("rsa gkp:keys=>", keys);
    return keys;
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
    console.log("rsa kypr:p1,p1,n,t =>", prime1, prime2, N, T);
    for (let e = 2; e < T; e++) {
      console.log("rsa kypr:e =>", e);
      if (N % e == 0 || T % e == 0) continue;
      console.log("rsa kypr:comprime test past =>", true);
      for (let d = e; d < T / 12; d + -2) {
        console.log("rsa kypr:d =>", d);
        if ((d * e) % T == 1 && e != d && d < 500000) {
          console.log("rsa kypr:valid keys =>", d, e, N);
          return {
            publicKey: { key: e, base: N },
            privateKey: { key: d, base: N },
          };
        }
      }
    }
  };

  keyPairgeneratorRSA2 = (prime1, prime2, min = 101) => {
    /**
     * N = product of prime1 and prime2
     * T = product of prime1 - 1 and prime2 - 1
     * e is a number between 2 and T-1 that is not a multiple of N or T
     * d is a number between 2 and T/12
     */

    let N = prime1 * prime2;
    let T = (prime1 - 1) * (prime2 - 1);
    for (let e = min; e < T; e++) {
      if (N % e == 0 || T % e == 0) continue;
      const d = this.getModularMultiplicativeInverse(e, T);
      if ((d * e) % T == 1) {
        return {
          publicKey: { key: e, base: N },
          privateKey: { key: d, base: N },
        };
      }
    }
  };

  getModularMultiplicativeInverse = (a, b) => {
    return this.extendedEuclideanAlgorithm2(a, b).x;
  };

  extendedEuclideanAlgorithm2 = (a, b) => {
    let vals = [
      [a, b],
      [1, 0],
      [0, 1],
    ];

    while (vals[0][1] !== 0) {
      const q = Math.floor(vals[0][0] / vals[0][1]);
      vals = vals.map((arr) => [arr[1], arr[0] - q * arr[1]]);
    }
    return {
      gcd: vals[0][0],
      x: vals[1][0],
      y: vals[2][0],
    };
  };
  extendedEuclideanAlgorithm = (a, b) => {
    const r_i = [a, b];
    const s_i = [1, 0];
    const t_i = [0, 1];

    while (r_i[r_i.length - 1] !== 0) {
      const q = Math.floor(r_i[0] / r_i[[1]]);
      r_i.push(r_i.shift() - q * r_i[0]);
      s_i.push(s_i.shift() - q * s_i[0]);
      t_i.push(t_i.shift() - q * t_i[0]);
    }
    return {
      gcd: r_i[0],
      x: s_i[0],
      y: t_i[0],
    };
  };

  greatestCommonDivisor = (a, b) => {
    if (a === b) return a;
    if (a === 0 || b === 0) return 0;
    while (a !== 0 && b !== 0) {
      if (a > b) {
        a %= b;
      } else {
        b %= a;
      }
    }
    return a === 0 ? b : a;
  };
}
