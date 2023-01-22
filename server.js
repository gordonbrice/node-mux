const WebSocket = require('ws');
const { ethers } = require("ethers");
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });


wss.on('connection', ws => {
    var fs = require('fs');
    var keystore = JSON.parse(fs.readFileSync('keystore.json', 'utf8'));
    var provider = new ethers.providers.WebSocketProvider(keystore.value);

    ws.on('message', message => {

        console.log(`Received message: ${message}`);
        ws.send(`Server received: ${message}`);

        if (message == "Infura") {
            provider.on('block', (blockNumber) => {
                console.log(`Block: ${blockNumber}`);
                //ws.send(`Block: ${blockNumber}`);

                const gas = async () => {
                    var gasPrice = await provider.getGasPrice();

                    console.log(`Gas: ${gasPrice}`);

                    var res = {};

                    res.Name = message.toString();
                    res.BlockNum = blockNumber.toString();
                    res.GasPrice = gasPrice.toString();
                    console.log(JSON.stringify(res));
                    //ws.send(`Gas: ${gasPrice}`);
                    ws.send(JSON.stringify(res));
                }
                gas();
            });

        }
        else {
            ws.send("Unrecognized message.");
        }
    });

    ws.on('close', () => {
        console.log("Closing connection.");
        provider._websocket.terminate();
    });
})