const WebSocket = require('ws');
const { ethers } = require("ethers");
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });


wss.on('connection', ws => {
    var fs = require('fs');
    var keystore = JSON.parse(fs.readFileSync('keystore.json', 'utf8'));
    var provider = new ethers.providers.WebSocketProvider(keystore.value);

    //console.log(keystore.value);
    //console.log(port);
    //ws.send(`Listening on port: ${port}`)
    ws.on('message', message => {

        console.log(`Received message: ${message}`);

        provider.on('block', (blockNumber) => {
            console.log(`Block: ${blockNumber}`);
            ws.send(`Block: ${blockNumber}`);
            const gas = async () => {
                var gasPrice = await provider.getGasPrice();

                console.log(`Gas: ${gasPrice}`);
                ws.send(`Gas: ${gasPrice}`);
            }
            gas();
        });
    });

    ws.on('close', () => {
        console.log("Closing connection.");
        provider._websocket.terminate();
    });
})