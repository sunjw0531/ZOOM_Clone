
import express from "express"
import http from "http"
import WebSocket from "ws"

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
// Allow pug's script work
app.use("/public", express.static(__dirname + "/public"));
//
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/"));

const handleListen = () => console.log(`listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];

// On server.js, 'socket' represents 'browser that just connected'
// but on app.js, 'socket' represents 'connection to the server'

wss.on("connection", (socket) =>{
    sockets.push(socket);
    console.log("Connected to Browser ✅ ");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (message) => {
        sockets.forEach((aSocket) => aSocket.send(message.toString("utf-8")));
      });
});

server.listen(3000, handleListen);