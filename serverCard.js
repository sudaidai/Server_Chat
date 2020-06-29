const SocketServer = require('websocket').server;
const http = require('http');
const port = 3000;

var table = [];
var tableNum = 0;

const server = http.createServer((req, res) => { });

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

wsServer = new SocketServer({ httpServer: server });

const connections = [];

/**JSON.parse(mes.utf8Data).kind */
wsServer.on('request', (req) => {
    const connection = req.accept();
    console.log('new connection');
    connections.push(connection);

    connection.on('message', (mes) => {
        console.log("---------------        SEND        ---------------");
        console.log(JSON.parse(mes.utf8Data).kind);
        console.log(JSON.parse(mes.utf8Data));
        switch (JSON.parse(mes.utf8Data).kind) {
            default:
                /**需要知道自己是幾桌的 */
                // console.log(tableJoin.roomNumber);
                connections.forEach(element => {
                    // if (element != connection) {
                        console.log("connection: ", element.remoteAddress);
                        console.log("message: ", mes);
                        element.sendUTF(mes.utf8Data);
                    // } else {
                    //     console.log("connection: ", element.remoteAddress);
                    //     console.log("message: ", mes);
                    // }
                    // if(JSON.parse(mes.utf8Data.USER) ==){

                    // }
                });
                break;
        }
    });

    connection.on('close', (resCode, des) => {
        console.log('connection closed');
        connections.splice(connections.indexOf(connection), 1);
    });
});