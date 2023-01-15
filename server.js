const WebSocket = require('ws');
const { ethers } = require("ethers");
const sql = require('mssql');
const wss = new WebSocket.Server({ port: 8080 });
require('dotenv').config();

wss.on('connection', ws => {
    //var fs = require('fs');
    //var keystore = JSON.parse(fs.readFileSync('keystore.json', 'utf8'));

    console.log(`URL: ${process.env.INFURA_WSS}`);

    ws.on('message', message => {

        var provider = new ethers.providers.WebSocketProvider(process.env.INFURA_WSS);

        console.log(`Received message: ${message}`);

        provider.on('block', (blockNumber) => {
            console.log(`Block: ${blockNumber}`);
            ws.send(`Block: ${blockNumber}`);
            const gas = async () => {
                console.log(`Gas: ${await provider.getGasPrice()}`);
                ws.send(`Gas: ${await provider.getGasPrice()}`);
            }
            gas();
        });
    })
})