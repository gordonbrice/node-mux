const WebSocket = require('ws');

const url = 'ws://localhost:8080';
//const url = 'ws://node-mux.azurewebsites.net';
const connection = new WebSocket(url);
const req = {
    Infura: true,
    EthNode: false,
    Alchemy: true,
    DataOption: "Leader",
    Log: false
};

connection.onopen = () => {
    connection.send(JSON.stringify(req));
}

connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
    console.log(e.data)
}