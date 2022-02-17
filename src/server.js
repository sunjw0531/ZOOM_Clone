
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

// Find the public rooms except private rooms
function publicRooms(){

    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
    // same code like below code
    // const {sids, rooms} = wsServer.sockets.adapter;
    // or same like below code
    const {sockets : {adapter : {sids, rooms}}} = wsServer;
    
    const publicRooms = [];
    rooms.forEach((_,key) =>{
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

wsServer.on("connection", (socket) =>{
    socket["nickname"] = "anonymous";
    socket.onAny((event) =>{
        console.log(`Socket Event : ${event}`);
    });
    socket.on("enter_room", (roomName,enterName, done) => {
        socket.join(roomName);
        socket["nickname"] = enterName;
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
        wsServer.sockets.emit("room_change", publicRooms());
    });
    // disconnecting event happen before socket has left the room
    socket.on("disconnecting", ()=>{
        socket.rooms.forEach(room=> socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) =>{
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname", nickname =>{
        socket["nickname"] = nickname;
    })
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