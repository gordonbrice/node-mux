const WebSocket = require('ws');
const { ethers } = require("ethers");
//const sql = require('mssql');
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });
//require('dotenv').config();
//const { DotenvAzure } = require('dotenv-azure');


wss.on('connection', ws => {
    var fs = require('fs');
    var keystore = JSON.parse(fs.readFileSync('keystore.json', 'utf8'));
    console.log(keystore.value);
    console.log(port);
    ws.send(`Listening on port: ${port}`)
    ws.on('message', message => {

        var provider = new ethers.providers.WebSocketProvider(keystore.value);

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