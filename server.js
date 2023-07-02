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
            const idx = providers.length;

            providers[idx] = startProvider("Infura", req.Log, ws);
        }

        if (req.Alchemy == true) {
            const idx = providers.length;

            providers[idx] = startProvider("Alchemy", req.Log, ws);
        }

        if (req.EthNode == true) {
            const idx = providers.length;

            //providers[idx] = startProvider("EthNode", req.Log, ws);
        }
    });

    ws.on('close', () => {
        console.log("Closing connections.");
        providers.forEach(disconnect);
    });
});

async function getClientVersion(providerName) {
    var web3;

    switch (providerName) {
        case "Infura":
            web3 = new Web3(process.env.INFURA_HTTPS);
            break;

        case "Alchemy":
            web3 = new Web3(process.env.ALCHEMY_HTTPS);
            break;

        case "EthNode":
            web3 = new Web3(process.env.ETHNODE_HTTPS);
            break;

        default:
            web3 = new Web3(process.env.INFURA_HTTPS);
            break;
    }

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

function startProvider(providerName, logBackToClient, ws) {
    var provider;

    switch (providerName) {
        case "Infura":
            console.log(`Starting ${providerName}`);
            provider = new ethers.providers.WebSocketProvider(process.env.INFURA_WSS);
            break;

        case "Alchemy":
            console.log(`Starting ${providerName}`);
            provider = new ethers.providers.WebSocketProvider(process.env.ALCHEMY_WSS);
            break;

        case "EthNode":
            console.log(`Starting ${providerName}`);
            provider = new ethers.providers.WebSocketProvider(process.env.ETHNODE_WS);
            break;

        default:
            console.log(`Starting default provider.`);
            provider = new ethers.providers.WebSocketProvider(process.env.INFURA_WSS);
            break;
    }

    provider.on('block', (blockNumber) => {
        console.log(`Block: ${blockNumber}`);

        if (logBackToClient) {
            ws.send(`Block: ${blockNumber}`);
            ws.send('Requesting data.');
        }

        var res = {};

        res.Name = providerName;
        res.BlockNum = blockNumber.toString();

        const gas = async () => {
            return await provider.getGasPrice();
        }

        let promises = [
            gas(),
            getClientVersion(providerName)
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

    return provider;
}

