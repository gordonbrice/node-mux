const { ethers } = require("ethers");


const provider = new ethers.providers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/015df1be12b048868f4207cab21cb8f9");

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