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

            case "createRoom":
                do {
                    /**生成文字 */
                    roomString = "";
                    var roomNumber = Math.round((Math.random() * 10000));
                    if (roomNumber.toString().length < 4) {
                        var diff = 4 - roomNumber.toString().length;
                        for (i = 0; i < diff; i++) {
                            roomString += 0;
                        }
                    }
                    roomString += roomNumber;
                    var boolean = false;
                    table.forEach(element => {
                        if (element.roomNumber == roomString) {
                            boolean = true;
                        }
                    });

                } while (boolean);

                /**
                 * 新增table
                 * roomNumber
                 * ip 
                 * name
                 * */
                table[tableNum] = {};
                table[tableNum].roomNumber = roomString;
                table[tableNum].ip = [];
                table[tableNum].ip.push(connection.remoteAddress);
                table[tableNum].name = [];
                table[tableNum].name.push(JSON.parse(mes.utf8Data).USER);//玩家名稱

                tableNum = tableNum + 1;

                var vTableInfo =
                {
                    type: 'utf8',
                    utf8Data: `{"kind":"createRoom","roomNum":"${roomString}","USER":"${JSON.parse(mes.utf8Data).USER}"}`
                }
                connections.forEach(element => {
                    if (element == connection) {
                        console.log("---------------        RECEIVE        ---------------");
                        console.log(vTableInfo.utf8Data);
                        element.sendUTF(vTableInfo.utf8Data);
                    }
                });
                break;
            case "joinRoom":
                // table.includes(roomString)
                // } else {
                console.log("按下加入按紐");
                var roomNum = JSON.parse(mes.utf8Data).roomNum; // 輸入的房間號碼
                var name = JSON.parse(mes.utf8Data).USER; // 輸入的USER
                var BooleanHas = false;
                var tableJoin ; 

                /**檢查是否有此桌號 */
                table.forEach(element => {
                    if (element.roomNumber == roomNum) {
                        element.ip.push(connection.remoteAddress);
                        element.name.push(name);
                        BooleanHas = true;
                        tableJoin = element ; 
                    }
                });

                if (BooleanHas) {
                    console.log("加入房間");
                    /**發送給此桌的人(包括自己) */
                    connections.forEach(element => {
                        if (tableJoin.ip.indexOf(element.remoteAddress) != -1) {
                            var vTableInfo =
                            {
                                type: 'utf8',
                                utf8Data: `{"kind":"joinRoom","joinBoolean":${BooleanHas},"otherPeople":${JSON.stringify(tableJoin)}}`
                            }
                            console.log("---------------        RECEIVE        ---------------");
                            console.log(vTableInfo.utf8Data);
                            element.sendUTF(vTableInfo.utf8Data);
                        }
                    });
                } else {
                    console.log("查無此房間");
                    /**發送回自己手上 */
                    connections.forEach(element => {

                        if (element == connection) {
                            var vTableInfo =
                            {
                                type: 'utf8',
                                utf8Data: `{"kind":"joinRoom","joinBoolean":"${BooleanHas}"}`
                            }
                            console.log("---------------        RECEIVE        ---------------");
                            console.log(vTableInfo.utf8Data);
                            element.sendUTF(vTableInfo.utf8Data);
                        }
                    });
                }

                // /**發送給同桌的人 */
                // connections.forEach(element => {
                //     if (table[i].ip.indexOf(element.remoteAddress) != -1 ) {

                //         console.log("---------------        發送給同桌的人        ---------------");
                //         console.log("---------------        RECEIVE        ---------------");
                //         console.log(table[i].ip);
                //         var vTableInfo =
                //         {
                //             type: 'utf8',
                //             utf8Data: `{"kind":"joinRoom","joinBoolean":${BooleanHas},"otherPeople":${JSON.stringify(table[i])}}`
                //         }
                //         console.log(vTableInfo.utf8Data);
                //         element.sendUTF(vTableInfo.utf8Data);
                //     }
                // });
                break;
            default:
                connections.forEach(element => {
                    if (element != connection && table[i].ip.indexOf(element.remoteAddress) != -1) {
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


        console.log("---------------        TABLE        ---------------");
        console.log(table);
    });

    connection.on('close', (resCode, des) => {
        console.log('connection closed');
        connections.splice(connections.indexOf(connection), 1);
    });
});