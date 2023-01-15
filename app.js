const { ethers } = require("ethers");
var fs = require('fs');
var keystore = JSON.parse(fs.readFileSync('keystore.json', 'utf8'));


const provider = new ethers.providers.WebSocketProvider(keystore.value);

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