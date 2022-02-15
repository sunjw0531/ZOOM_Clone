
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
const ws = new WebSocket.Server({server});

server.listen(3000, handleListen);