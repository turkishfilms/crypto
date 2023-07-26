

export class Block {
  constructor() {
    this.prevHash;
    this.id;
    this.data;
    this.nonce;
  }
}

export class GenesisBlock{
    constructor(){
        this.prevHash = 0x000000000000000
        this.id = 0
        this.data = 0
        this.nonce = 0
    }
}

export default class BlockChain {
    constructor(){
        this.chain = [new GenesisBlock()]
    }

    addBlock=(block)=>{

    }
}