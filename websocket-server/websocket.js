import { readFile } from "node:fs/promises";
import { createServer } from "node:https";
import { Server } from "socket.io";

const key = await readFile("./key.pem");
const cert = await readFile("./cert.pem");

const server = createServer({ key, cert });
const io = new Server(server, {
  cors: {
    origin: "https://localhost:8080",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
