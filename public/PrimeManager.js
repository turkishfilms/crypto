export default class PrimeManager {
  constructor() {}
  isPrime(num, primesList) {
    if (num <= primesList[primesList.length] * 2) {
      return this.smallPrimeTest(num, primesList);
    }
    if (num == 2 || num == 3) return true;
    if (num <= 1 || num % 2 == 0 || num % 3 == 0) return false;
    for (let i = 5; i * i <= num; i += 6)
      if (num % i == 0 || num % (i + 2) == 0) return false;
    return true;
  }

  smallPrimeTest = (num, primesList) => {
    return primesList.some((prime) => {
      return num % prime === 0;
    });
  };

  randomPrimeGenerator = (input, primesList) => {
    // find a more efficient way to search
    if (typeof input !== "number" || !Number.isInteger(input)) {
      throw new Error("Input must be an integer");
    }
    if (input < 4) return 3;
    let potentialPrime = input % 2 == 0 ? input + 1 : input;
    while (!this.isPrime(potentialPrime, primesList)) {
      potentialPrime += 2; //this is really crude and terribly inefficient for big integers
    }
    return potentialPrime;
  };
}
