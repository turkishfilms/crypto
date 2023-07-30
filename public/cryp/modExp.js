const modExp = (base, exp = 67, mod) => {
  if (exp == 1) return base % mod;
  if (exp == 2) return base ** 2 % mod;
  const expBinaryString = exp
    .toString(2)
    .split("")
    .map((digit) => (digit == "0" ? "0" : "01"))
    .join("")
    .split("")
    .map((d) => Number(d));
  // .splice(0, this[1] == 1 ? 1 : 0);

  if (expBinaryString[1] === 1) expBinaryString.splice(0, 1);

  let currentNumber = base;
  expBinaryString.forEach((instruction) => {
    currentNumber =
      (currentNumber * (instruction == 1 ? currentNumber : base)) % mod;
  });
  return currentNumber;
};

const gptModExp = (base, exp, mod) => {
  if (mod === 1) return 0;

  let result = 1;
  base = base % mod;

  while (exp > 0) {
    // If exp is odd, multiply base with result
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }

    // exp must be even now
    exp = Math.floor(exp / 2);
    base = (base * base) % mod;
  }

  return result;
};
const gptModExpBigInt = (base, exp, mod) => {
  if (mod === 1n) return 0n;

  let result = 1n;
  base = base % mod;

  while (exp > 0n) {
    // If exp is odd, multiply base with result
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }

    // exp must be even now
    exp = exp / 2n;
    base = (base * base) % mod;
  }

  return result;
};

export { gptModExp, gptModExpBigInt };

export default modExp;
