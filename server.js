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
                if (JSON.parse(mes.utf8Data).roomNum.length < 4) {
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
                        var boolean = false;
                        table.forEach(element => {
                            console.log(roomString);
                            if (element.roomNumber == roomString) {
                                boolean = true;
                            }
                        });

                    } while (boolean);

                    table[tableNum] = {};
                    table[tableNum].roomNumber = roomString;
                    table[tableNum].ip = [];
                    table[tableNum].ip.push(connection.remoteAddress);
                    tableNum = tableNum + 1;
                    console.log(table);
                    var vTableInfo =
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
                } else {
                    console.log("按下加入按紐"); 
                    var BooleanHas = false;
                    table.forEach(element => {
                        if (element.roomNumber == JSON.parse(mes.utf8Data).roomNum) {
                            element.ip.push(connection.remoteAddress);
                            BooleanHas = true;

                        }
                    });

                    var vTableInfo =
                    {
                        type: 'utf8',
                        utf8Data: `{"kind":"roomJoin","roomNum":"${BooleanHas}"}`
                    }

                    if (BooleanHas) {
                        console.log("加入房間");                                          
                    } else {
                        console.log("查無此房間");
                    }

                    connections.forEach(element => {
                        if (element == connection) {
                            console.log("connection: ", element.remoteAddress);
                            console.log("room: ", vTableInfo);
                            element.sendUTF(vTableInfo.utf8Data);
                        }
                    });

                }

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