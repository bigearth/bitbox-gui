class BlockHeader {
  constructor(blockHeaderData) {
    this.version = 0;
    this.hashPrevBlock = blockHeaderData.hashPrevBlock;
    this.hashMerkleRoot = blockHeaderData.hashMerkleRoot;
    this.time = blockHeaderData.time;
    this.bits = blockHeaderData.bits;
    this.nonce = blockHeaderData.nonce;
  }
}

export default BlockHeader;
