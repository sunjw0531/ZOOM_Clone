
import express from "express"
import http from "http"
import SocketIO from "socket.io"

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
// Allow pug's script work
app.use("/public", express.static(__dirname + "/public"));
//
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);


wsServer.on("connection", (socket) =>{
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        setTimeout(()=>{
            // done() function is not running on backend because of security,
            // instead running on frontend function backendDone()
            done("hello from the backend");
        }, 10000);
    });
})

// const wss = new WebSocket.Server({server});

// const sockets = [];

// // On server.js, 'socket' represents 'browser that just connected'
// // but on app.js, 'socket' represents 'connection to the server'

// wss.on("connection", (socket) =>{
//     sockets.push(socket);
//     socket["nickname"] = "anonymous";
//     console.log("Connected to Browser ✅ ");
//     socket.on("close", () => console.log("Disconnected from the Browser ❌"));
//     socket.on("message", (msg) =>{
//         const message = JSON.parse(msg);
//         switch(message.type){
//             case "new_message" :
//                 sockets.forEach((aSocket) =>
//                 aSocket.send(`${socket.nickname} : ${message.payload}`)
//                 );
//                 break;
//             case "nickname" :
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     })
// });

httpServer.listen(3000, handleListen);