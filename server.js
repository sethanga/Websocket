
const WebSocket = require("ws");
const express = require("express");
const app = express()
const path = require("path");
const cli = require("nodemon/lib/cli");

const users = []
var prefixText = "";

// app.get("/chat", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "index.html"))
// });
 
 const myServer = app.listen(9876, () => {
    console.log("Server started at http://localhost:9876")
})   // regular http server using node express which serves your webpage

const wsServer = new WebSocket.Server({
     //noServer: true,
     server: myServer,
     path: "/chatServer",
        clientTracking: true,
        maxPayload: 1024,
        perMessageDeflate: true,
        verifyClient: (info, done) => {
            //handle authenication/authorization
            done(true)
        }
}, () =>{
    console.log("Websocket server started at ws://localhost:9876")
});                             // a websocket server


wsServer.on("connection", function (ws) {    // what should a websocket do on connection
    ws.on("message", function (msg) {
        var messageJson = JSON.parse(msg);
        console.log(messageJson)
        wsServer.clients.forEach(
           // for each(client)
            (client) => {
                if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                    client == ws ? prefixText = "you" : prefixText = messageJson.sender

                    messageJson.join == true ? client.send(prefixText + " " + "Joined the chat") 
                    : client.send(prefixText + " : " + messageJson.msg)   // send message to all clients

                }
            })

    })
    ws.on("close", function (event) {
        console.log("Client disconnected")
    })
    console.log("New client connected")
})

// Http Upgrade to websocket
// myServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event

//     // accepts half requests and rejects half. Reload browser page in case of rejection

//     if (Math.random() > 0.5) {
//         return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii")     //proper connection close in case of rejection
//     }

//     //emit connection when request accepted
//     wsServer.handleUpgrade(request, socket, head, function done(ws) {
//         wsServer.emit('connection', ws, request);
//     });
// });