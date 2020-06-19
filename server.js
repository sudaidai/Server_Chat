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

wsServer.on('request', (req) => {
    const connection = req.accept();
    console.log('new connection');
    connections.push(connection);

    connection.on('message', (mes) => {
        console.log(JSON.parse(mes.utf8Data).kind);
        switch (JSON.parse(mes.utf8Data).kind) {
            case "room":
                do {
                    /**生成文字 */
                    roomString = "";
                    var roomNumber = Math.round((Math.random() * 3));
                    if (roomNumber.toString().length < 4) {
                        var diff = 4 - roomNumber.toString().length;
                        for (i = 0; i < diff; i++) {
                            roomString += 0;
                        }
                    }
                    roomString += roomNumber;
                    console.log(roomString);

                    var boolean = false;
                    table.forEach(element => {
                        console.log("element : " + element.roomNumber);
                        console.log("element : " + element);
                        console.log(roomString);
                        if (element.roomNumber == roomString) {
                            boolean = true;
                        }
                    });

                } while (boolean);
                // table.push(roomString);


                table[tableNum] = {};
                table[tableNum].roomNumber = roomString;
                table[tableNum].ip = [];
                table[tableNum].ip.push(connection.remoteAddress);

                tableNum = tableNum + 1;
                console.log(table);


                var vTableInfo;
                vTableInfo =
                {
                    type: 'utf8',
                    utf8Data: `{"kind":"room","roomNum":"${roomString}"}`
                }
                connections.forEach(element => {
                    if (element == connection) {
                        console.log("connection: ", element.remoteAddress);
                        console.log("room: ", vTableInfo);
                        element.sendUTF(vTableInfo.utf8Data);
                    }
                });
                // table.includes(roomString)


                break;
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
                break;
        }
    });

    connection.on('close', (resCode, des) => {
        console.log('connection closed');
        connections.splice(connections.indexOf(connection), 1);
    });
});