require('dotenv').config();
const { ethers } = require("ethers");
const provider = new ethers.providers.WebSocketProvider(process.env.INFURA_WSS);


provider.on('block', (blockNumber) => {
    console.log('Block: ' + blockNumber);

    const gas = async () => {
        console.log('Gas:' + await provider.getGasPrice());
    }
    gas();

/*     const block = async() => {
        console.log(await provider.getBlock());
    }
    block();
 */  });