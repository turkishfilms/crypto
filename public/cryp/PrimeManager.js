/**
 * Class for managing prime numbers and generating prime pairs.
 */
export default class PrimeManager {
  /**
   * Create a new PrimeManager instance.
   * @param {number[]} primeList - Array of existing prime numbers (optional).
   */
  constructor(primeList) {
    this.primesList = primeList || [];
  }

  /**
   * Generates a pair of different prime numbers from two input seed values.
   * @param {number} input1 - The first input seed value.
   * @param {number} input2 - The second input seed value.
   * @returns {Object} An object containing two prime numbers.
   */
  generatePrimePair = (input1, input2) => {
    const prime1 = this.randomPrimeGenerator(input1);
    const prime2 = this.findUniquePrime(
      prime1,
      this.randomPrimeGenerator(input2)
    );

    return { prime1, prime2 };
  };

  /**
   * Generates a random prime number greater than the given input.
   * @param {number} input - The input value to start searching for a prime.
   * @param {number[]} primesList - Array of existing prime numbers (optional).
   * @returns {number} A prime number greater than the given input.
   * @throws {Error} If the input is not a positive integer.
   */
  randomPrimeGenerator = (input, primesList = this.primesList) => {
    if (typeof input !== "number" || !Number.isInteger(input) || input <= 0) {
      throw new Error("Input must be a positive integer.");
    }

    if (input < 4) return 3;

    let potentialPrime = input % 2 === 0 ? input + 1 : input;
    while (!this.isPrime(potentialPrime, primesList)) potentialPrime += 2; // This method is inefficient for large integers

    return potentialPrime;
  };

  /**
   * Checks if a number is prime based on the provided prime list.
   * @param {number} num - The number to check for primality.
   * @param {number[]} primesList - Array of existing prime numbers (optional).
   * @returns {boolean} True if the number is prime, otherwise false.
   */
  isPrime = (num, primesList = this.primesList) => {
    if (num <= primesList[primesList.length - 1] * 2) {
      return !this.smallPrimeTest(num, primesList);
    }

    if (num === 2 || num === 3) return true;
    if (num <= 1 || num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }

    return true;
  };

  /**
   * Checks if the number is divisible by any small prime in the list.
   * @param {number} num - The number to check.
   * @param {number[]} primesList - Array of existing prime numbers (optional).
   * @returns {boolean} True if the number is divisible by any small prime, otherwise false.
   */
  smallPrimeTest = (num, primesList = this.primesList) => {
    return primesList.some((prime) => {
      return num % prime === 0;
    });
  };

  /**
   * Generates a different prime number from the given prime1 and prime2.
   * @param {number} prime1 - The first prime number.
   * @param {number} prime2 - The second prime number.
   * @param {number[]} primeList - Array of existing prime numbers (optional).
   * @returns {number} A different prime number.
   */
  findUniquePrime = (prime1, prime2, primeList = this.primesList) => {
    return prime1 === prime2
      ? this.randomPrimeGenerator(prime2 * 2, primeList)
      : prime2;
  };
}
