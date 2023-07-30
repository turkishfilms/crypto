import Security from "./Security.js";
export default class Whirlpool {
  constructor() {
    this.sBox = [
      [24, 35, 198, 232, 135, 184, 1, 79, 54, 166, 210, 245, 121, 111, 145, 82],
      [96, 188, 11, 142, 163, 12, 123, 53, 29, 224, 215, 194, 46, 75, 254, 87],
      [
        21, 119, 55, 229, 159, 240, 74, 202, 88, 201, 41, 10, 177, 160, 107,
        133,
      ],
      [189, 93, 16, 244, 203, 62, 5, 103, 228, 39, 65, 139, 167, 125, 149, 200],
      [251, 238, 124, 102, 221, 23, 71, 158, 202, 45, 191, 7, 173, 90, 131, 51],
      [99, 2, 170, 113, 200, 25, 73, 201, 242, 227, 91, 136, 154, 38, 50, 176],
      [
        233, 15, 213, 128, 190, 205, 52, 72, 255, 122, 144, 95, 32, 104, 26,
        174,
      ],
      [180, 84, 147, 34, 100, 241, 115, 18, 64, 8, 195, 236, 219, 161, 141, 61],
      [151, 0, 207, 43, 118, 130, 214, 27, 181, 175, 106, 80, 69, 243, 48, 239],
      [63, 85, 162, 234, 101, 186, 47, 192, 222, 28, 253, 77, 146, 117, 6, 138],
      [178, 230, 14, 31, 98, 212, 168, 150, 249, 197, 37, 89, 132, 114, 57, 76],
      [94, 120, 56, 140, 193, 165, 226, 97, 179, 33, 156, 30, 67, 199, 252, 4],
      [
        81, 153, 109, 13, 250, 223, 126, 36, 59, 171, 206, 17, 143, 78, 183,
        235,
      ],
      [60, 129, 148, 247, 185, 19, 44, 211, 231, 110, 196, 3, 86, 68, 127, 169],
      [
        42, 187, 193, 83, 220, 11, 157, 108, 49, 116, 246, 70, 172, 137, 20,
        225,
      ],
      [22, 58, 105, 9, 112, 182, 192, 237, 204, 66, 152, 164, 40, 92, 248, 134],
    ];
    this.transitionMatrix = [
      [1, 1, 4, 1, 8, 5, 2, 9],
      [9, 1, 1, 4, 1, 8, 5, 2],
      [2, 9, 1, 1, 4, 1, 8, 5],
      [5, 2, 9, 1, 1, 4, 1, 8],
      [8, 5, 2, 9, 1, 1, 4, 1],
      [1, 8, 5, 2, 9, 1, 1, 4],
      [4, 1, 8, 5, 2, 9, 1, 1],
      [1, 4, 1, 8, 5, 2, 9, 1],
    ];
  }
  asciiify = (str) => {
    return str.split("").map((char) => char.charCodeAt());
  };
  hash = (plaintext_) => {
    const plaintext = this.asciiify(plaintext_);
    const padded = this.mDPadding(plaintext);
    const blocks = this.initBlocks(padded, 512);
    console.log("result---", typeof padded, blocks);
    let hashMatrix = this.initHashMatrix(8, 8, 0);
    for (let i = 0; i < blocks.length; i++) {
      hashMatrix = this.oneBlock(blocks[i], hashMatrix, this.sBox);
    }
    // return hashMatrix.flat()
    return this.toFormattedHexString(hashMatrix);
  };

  ////////////////

  mDPadding = (m) => {
    //m is your message encoded in ascii/unicode aka an array of decimal number 0- 128
    const message = m
      .map((charCode) => charCode.toString(2).padStart(8, "0"))
      .join("");

    return (
      message +
      "1" +
      Array(this.nearestOddMultiple(message.length, 256) - message.length - 1)
        .fill("0")
        .join("") +
      message.length.toString(2).padStart(256, "0")
    );
  };

  initBlocks = (plaintext, blockSize) => {
    const blocks = [];
    for (let i = 0; i < plaintext.length / blockSize; i++) {
      blocks.push(
        this.convertBlockToMatrix(
          plaintext.substring(i * blockSize, (i + 1) * blockSize)
        )
      );
    }
    return blocks;
  };

  convertBlockToMatrix = (block) => {
    const a = block.split(""); 
    const bs = [];
    for (let i = 0; i < a.length; i += 8) {
      const byteString = a.slice(i, i + 8).join("");
      const byte = parseInt(byteString, 2);
      bs.push(byte);
    }
    const mt = [];
    for (let i = 0; i < bs.length; i += 8) {
      mt.push(bs.slice(i, i + 8));
    }
    return mt;
  };

  initHashMatrix = (x = 8, y = 8, n = 0) => {
    return Array(x).fill(Array(y).fill(n));
  };

  oneBlock = (block, key, rcs) => {
    const message = block.map((row) => [...row]);
    const hashKey = key.map((row) => [...row]);
    const roundConstantSchedule = rcs.map((row) => [...row]);

    let h = hashKey;
    let m = this.startup(message, h);
    for (let i = 0; i < 10; i++) {
      let roundConstant = [
        roundConstantSchedule[i].slice(0, 8),
        ...Array(7).fill(Array(8).fill(0)),
      ];
      let { wMessage, wHashKey } = this.round(m, h, roundConstant);
      h = wHashKey;
      m = wMessage;
    }
    const blockDigest = this.addRoundKey(this.addRoundKey(m, hashKey), block);
    return blockDigest;
  };

  startup = (b, k) => {
    return this.addRoundKey(b, k);
  };

  round = (block, key, roundConstant) => {
    const message = block.map((row) => [...row]);
    const hashKey = key.map((row) => [...row]);
    const wHashKey = this.W(hashKey, roundConstant);
    const wMessage = this.W(message, wHashKey);
    return { wMessage, wHashKey };
  };

  W = (CState, key) => {
    const thing = this.shiftColumns(this.subBytes(CState, this.sBox));
    return this.addRoundKey(thing, key);
  };

  //////
  nearestOddMultiple = (n = 1, m = 256) => {
    if (n === 0) return m;
    if (n % m == 0 && Math.ceil(n / m) % 2 == 1) {
      return n + 2 * m;
    }
    return (Math.ceil(n / m) + (Math.ceil(n / m) % 2 ? 0 : 1)) * m;
  };

  toFormattedHexString = (hashMatrix) => {
    return hashMatrix
      .flat()
      .map((code) => code.toString(16).toUpperCase().padStart(2, "0"))
      .join("");
  };
  ///////
  subByte = (m, sbox) => {
    return sbox[m >>> 4][m & 0b00001111];
  };

  subBytes = (block, sBox) => {
    return Array.from({ length: 8 }, (_, x) => {
      return Array.from({ length: 8 }, (_, y) =>
        this.subByte(block[x][y], sBox)
      );
    });
  };

  shiftColumns = (b = [["0"]]) => {
    const block = b.map((row) => [...row]);
    for (let i = 1; i < 8; i++) {
      let col = block[i];
      let section = col.splice(col.length - i);
      section.push(...col);
      block[i] = section;
    }
    return block;
  };

  mixRows = (block = [["0"]], transitionMatrix = [[1]]) => {
    return this.gptMR(block, transitionMatrix);
    // return block.map((row, x) => [
    //   ...row.map((col, y) => [
    //     ...col.map((cell, z) => {
    //       return block[x][y];
    //     }),
    //   ]),
    // ]);
  };

  gptMIG = (element1, element2, poly) => {
    //heng
    // Function to multiply two elements in GF(2^8)
    let result = 0;
    let carry = 0;
    for (let i = 0; i < 8; i++) {
      if (element2 & (1 << i)) {
        result ^= element1;
      }
      carry = element1 & 0x80;
      element1 <<= 1;
      if (carry) {
        element1 ^= poly;
      }
    }
    return result;
  };

  gptMR = (matrixA, matrixB) => {
    //hsing
    const irreduciblePoly = 0b100011011; // The polynomial x^8 + x^4 + x^3 + x^2 + 1
    // Function to perform matrix multiplication in GF(2^8)
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
      const row = [];
      for (let j = 0; j < matrixB[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < matrixB.length; k++) {
          sum ^= this.gptMIG(matrixA[i][k], matrixB[k][j], irreduciblePoly);
        }
        row.push(sum);
      }
      result.push(row);
    }
    return result;
  };

  addRoundKey = (block, key) => {
    return Array.from({ length: 8 }, (_, x) => {
      return Array.from({ length: 8 }, (_, y) => block[x][y] ^ key[x][y]);
    });
  };
}
