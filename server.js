const WebSocket = require('ws');
const { ethers } = require("ethers");
const { Web3 } = require('web3');
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });
require('dotenv').config();

wss.on('connection', ws => {
    const providers = [];

    ws.on('message', message => {
        var req = JSON.parse(message);

        //console.log(`Received message: ${message}`);
        if (req.Log == true) {
            ws.send(`Server received: ${message}`);
        }

        if (req.Infura == true) {
            var provider = new ethers.providers.WebSocketProvider(process.env.INFURA_WSS);
            const idx = providers.length;

            providers[idx] = provider;
            provider.on('block', (blockNumber) => {
                console.log(`Block: ${blockNumber}`);

                if (req.Log == true) {
                    ws.send(`Block: ${blockNumber}`);
                    ws.send('Requesting data.');
                }

                var res = {};

                res.Name = "Infura";
                res.BlockNum = blockNumber.toString();

                const gas = async () => {
                    return await provider.getGasPrice();
                }

                let promises = [
                    gas(),
                    getClientVersion()
                ]

                Promise.all(promises).then((values) => {
                    res.GasPrice = values[0].toString();
                    res.EL_ClientVer = values[1].toString();
                    console.log(JSON.stringify(res));
                    ws.send(JSON.stringify(res));
                }).catch((error) => {
                    console.error(error);
                    ws.send(error);
                })
            });
        }
        else {
            ws.send("Unrecognized message.");
        }
    });

    ws.on('close', () => {
        console.log("Closing connections.");
        providers.forEach(disconnect);
    });
});

async function getClientVersion() {
    const web3 = new Web3(process.env.INFURA_HTTPS);

    try {
        return await web3.eth.getNodeInfo();
    } catch (error) {
        console.error('Failed to get client version:', error);
    }
}

function disconnect(provider, index, array) {
    provider._websocket.terminate();
    console.log(`Disconnected: ${index}`);
}

