import { readFile } from "node:fs/promises";
import { createServer } from "node:https";
import express from "express";
import path from "path";

const __dirname = path.resolve(path.dirname(""));

const key = await readFile("./key.pem");
const cert = await readFile("./cert.pem");

const app = express();
const server = createServer({ key, cert }, app);

app.get("/ws-benchmark.js", (req, res) => {
  res.sendFile(__dirname + "/ws-benchmark.js");
});

app.get("/wt-benchmark.js", (req, res) => {
  res.sendFile(__dirname + "/wt-benchmark.js");
});

app.get("/wt-datagram-benchmark.js", (req, res) => {
  res.sendFile(__dirname + "/wt-datagram-benchmark.js");
});

app.get("/common.js", (req, res) => {
  res.sendFile(__dirname + "/common.js");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(8080, () => {
  console.log("Server listening on :8080");
});
