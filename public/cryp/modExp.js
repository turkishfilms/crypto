const modularExponentiation = (base, exp, mod) => {
  let result = BigInt(1);
  base = base % mod;

  while (exp > BigInt(0)) {
    if (exp & BigInt(1)) {
      result = (result * base) % mod;
    }
    exp >>= BigInt(1);
    base = (base * base) % mod;
  }

  return result;
};
export default modularExponentiation;
