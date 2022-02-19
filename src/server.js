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

wsServer.on("connection", socket =>{
    socket.on("join_room", (roomName, done) =>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) =>{
        socket.to(roomName).emit("offer", offer);
    })
})


httpServer.listen(3000, handleListen);