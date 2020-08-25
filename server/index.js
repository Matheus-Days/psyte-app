import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import cookieParser from "cookie-parser";
import consign from "consign";
import cors from "cors";
import http from "http";
import socket from "socket.io";
import render from "./render";

const app = express();
app.db = require("./config/db");
const server = http.createServer(app);
const io = socket(server);
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

consign()
  .include("./server/config/passport.js")
  .then("./server/config/websocket.js")
  .then("./server/api/validation.js")
  .then("./server/api")
  .then("./server/config/routes.js")
  .into(app, io);

app.get("/", render);

app.use(express.static(__dirname + "/"));

app.use(render);

server.listen(PORT, () => {
  app.port = server.address().port;
  console.log("Server listening on port", server.address().port);
});
