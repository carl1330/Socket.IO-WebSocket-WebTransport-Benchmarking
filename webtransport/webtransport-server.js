import { readFile } from "node:fs/promises";
import { createServer } from "node:https";
import { Server } from "socket.io";
import { Http3Server } from "@fails-components/webtransport";
import express from "express";

const key = await readFile("./key.pem");
const cert = await readFile("./cert.pem");

const app = express();
const server = createServer({ key, cert }, app);

const io = new Server(server, {
  transports: ["webtransport"],
});

io.on("connection", async (socket) => {
  for (let i = 0; i < 5000; i++) {
    socket.send(i);
    await sleep(1);
  }
  socket.disconnect();
});

io.of("/chat").on("connection", async (socket) => {
  console.log("a user connected to chat");
  for (let i = 0; i < 5000; i++) {
    socket.send(i);
  }
});

io.of("/game").on("connection", async (socket) => {
  console.log("a user connected to game");
  for (let i = 0; i < 5000; i++) {
    socket.send(i);
    await sleep(1);
  }
});

server.listen(3002, () => {
  console.log("listening on *:3000");
});

const h3Server = new Http3Server({
  port: 3002,
  host: "0.0.0.0",
  secret: "changeit",
  cert,
  privKey: key,
});

h3Server.startServer();

(async () => {
  const stream = await h3Server.sessionStream("/socket.io/");
  const sessionReader = stream.getReader();

  while (true) {
    const { done, value } = await sessionReader.read();
    if (done) {
      break;
    }
    io.engine.onWebTransportSession(value);
  }
})();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
