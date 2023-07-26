import Whirlpool from "./Whirlpool.js";
import PrimeManager from "./PrimeManager.js";
import RSA from "./RSA.js";
import Security from "./Security.js";
import Blockchain from "./Blockchain.js";
import primeList from "./Primes.js";

window.translator = new Security();

window.primeManager = new PrimeManager();
window.rsa = new RSA();

window.whirlpool = new Whirlpool();

window.blockchain = new Blockchain();

window.m =
  "Lorem ipsum dolor sit amet consectetur adipisicing brbvweruv ewruv ewrugv eruvreuoecrxh hre byugvuyxbuery xeruyffgereuqionde d3iud uudqoudnzqnmv bvcv bunrhf x8fiurfi4hf8347xf hq3indo3id iquznqf ryzf380fz q34fn3q4inf43kcfnpi fx80hf0q38b8";

window.um = translator.encodeMessageUnicode(m);
window.code = (m) => {
  console.log(window.whirlpool.hash(window.translator.encodeMessageUnicode(m)));
};
