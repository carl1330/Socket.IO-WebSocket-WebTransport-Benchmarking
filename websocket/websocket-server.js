import { readFile } from "node:fs/promises";
import { createServer } from "node:https";
import { Server } from "socket.io";
import express from "express";

const key = await readFile("./key.pem");
const cert = await readFile("./cert.pem");

const app = express();
const server = createServer({ key, cert }, app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

io.on("connection", async (socket) => {
  console.log("a user connected");
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
    await sleep(1);
  }
});

io.of("/game").on("connection", async (socket) => {
  console.log("a user connected to game");
  for (let i = 0; i < 5000; i++) {
    socket.send(i);
    await sleep(1);
  }
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

server.listen(3000, () => {
  console.log("listening on *:3000");
});

function generate_random_data(size) {
  return new Blob([new ArrayBuffer(size)], {
    type: "application/octet-stream",
  });
}
