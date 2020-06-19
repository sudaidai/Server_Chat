const SocketServer = require('websocket').server;
const http = require('http');
const port = 3000;

var table = [];


const server = http.createServer((req, res) => { });

server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

wsServer = new SocketServer({ httpServer: server });

const connections = [];

wsServer.on('request', (req) => {
    const connection = req.accept();
    console.log('new connection');
    connections.push(connection);

    connection.on('message', (mes) => {

        console.log(JSON.parse(mes.utf8Data).kind);
        switch (JSON.parse(mes.utf8Data).kind) {
            case "room":
                var roomString = "";
                var roomNumber = Math.round((Math.random() * 10000));
                if (roomNumber.toString().length < 4) {
                    var diff = 4 - roomNumber.toString().length;
                    for (i = 0; i < diff; i++) {
                        roomString += 0;
                    }
                }
                console.log(roomString);
                roomString += roomNumber;
                var vTableInfo;
                vTableInfo =
                {
                    type: 'utf8',
                    utf8Data: `{"kind":"room","roomNum":${roomString}}`
                }
                connections.forEach(element => {
                    if (element == connection) {
                        console.log("connection: ", element.remoteAddress);
                        console.log("message: ", vTableInfo);
                        element.sendUTF(vTableInfo.utf8Data);
                    }
                });
            default:
                connections.forEach(element => {
                    if (element != connection) {
                        console.log("connection: ", element.remoteAddress);
                        console.log("message: ", mes);
                        element.sendUTF(mes.utf8Data);
                    } else {

                        console.log(table.length);
                        console.log("connection: ", element.remoteAddress);
                        console.log("message: ", mes);
                    }
                });
        }
    });

    connection.on('close', (resCode, des) => {
        console.log('connection closed');
        connections.splice(connections.indexOf(connection), 1);
    });
});