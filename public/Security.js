export default class Security {
  constructor() {}
  encryptMessage = (message, key) => {
    return message.map((uniChar, index) => uniChar + key[index]);
  };

  decryptMessage = (encryptedMessage, key) => {
    return encryptedMessage.map((char, index) => char - key[index]);
  };

  encodeMessageUnicode = (message) => {
    return message.split("").map((char) => char.charCodeAt());
  };

  decodeMessageUnicode = (uniCode) => {
    return uniCode.map((char) => String.fromCharCode(char)).join("");
  };

  generateKey = (length, range) => {
    return Array(length)
      .fill(1)
      .map(() => Math.ceil(Math.random() * range));
  };

  symmetricKeyCryptography = (str, key) => {
    return this.decodeMessageUnicode(
      this.decryptMessage(
        this.encryptMessage(this.encodeMessageUnicode(str), key),
        key
      )
    );
  };
}
