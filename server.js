const WebSocket = require('ws');
const { ethers } = require("ethers");

const wss = new WebSocket.Server({ port: 8080 })
const provider = new ethers.providers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/015df1be12b048868f4207cab21cb8f9");

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(`Received message => ${message}`);
        if (message == "Infura") {
            provider.on('block', (blockNumber) => {
                console.log(`Block: ${blockNumber}`);
                ws.send(`Block: ${blockNumber}`);
                const gas = async () => {
                    console.log(`Gas: ${await provider.getGasPrice()}`);
                    ws.send(`Gas: ${await provider.getGasPrice()}`);
                }
                gas();
            });
        }
    })
    //ws.send('Hello! Message From Server!!')
})