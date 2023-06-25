const WebSocket = require('ws');
const { ethers } = require("ethers");
const { Web3 } = require('web3');
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: port });
require('dotenv').config();

wss.on('connection', ws => {
    var fs = require('fs');

    var provider = new ethers.providers.WebSocketProvider(process.env.INFURA_WSS);

    ws.on('message', message => {

        console.log(`Received message: ${message}`);
        ws.send(`Server received: ${message}`);

        if (message == "Infura") {
            provider.on('block', (blockNumber) => {
                console.log(`Block: ${blockNumber}`);
                //ws.send(`Block: ${blockNumber}`);

                var res = {};

                res.Name = message.toString();
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
                    //ws.send(`Gas: ${gasPrice}`);
                    ws.send(JSON.stringify(res));
                }).catch((error) => {
                    console.error(error);
                })
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
});

async function getClientVersion() {
    /*const web3 = () => {
        return (web3 = new Web3(
            new Web3.providers.HttpProvider(process.env.INFURA_HTTPS)
        ));
    }*/
    const web3 = new Web3(process.env.INFURA_HTTPS);

    try {
        return await web3.eth.getNodeInfo();
    } catch (error) {
        console.error('Failed to get client version:', error);
    }
}

/*async function GetEL_Version() {
    const http = require('http');

    var postData = JSON.stringify({
        'jsonrpc': '2.0',
        'method': 'web3_clientVersion',
        'params': [],
        'id': 67
    });

    var options = {
        hostname: 'http://192.168.68.50/',
        port: 8545,
        path: '',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    var req = http.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        res.on('data', (d) => {
            return d;
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);
    req.end();
}*/