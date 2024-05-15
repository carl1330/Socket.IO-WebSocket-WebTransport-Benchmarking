import { readFile } from "node:fs/promises";
import { createServer } from "node:https";
import { Http3Server } from "@fails-components/webtransport";
import express from "express";

const key = await readFile("./key.pem");
const cert = await readFile("./cert.pem");

const app = express();
const server = createServer({ key, cert }, app);

server.listen(3001, () => {
  console.log("listening on *:3001");
});

async function runEchoServer(server) {
  try {
    const sessionStream = await server.sessionStream("/echo");
    const sessionReader = sessionStream.getReader();
    while (true) {
      const { done, value } = await sessionReader.read();
      if (done) {
        console.log("Server is gone");
        break;
      }
      await value.ready;
      const writer = value.datagrams.writable.getWriter();
      for (let i = 0; i < 5000; i++) {
        await sleep(1);
        writer.write(intToBytes(i));
      }
      value.close();
    }
  } catch (error) {
    console.log("problem in runEchoServer", error);
  }
}

const h3Server = new Http3Server({
  port: 3001,
  host: "0.0.0.0",
  secret: "changeit",
  cert,
  privKey: key,
});

function intToBytes(int) {
  const bytes = new Uint8Array(4); // Assuming 4 bytes for integer
  bytes[0] = (int >> 24) & 0xff;
  bytes[1] = (int >> 16) & 0xff;
  bytes[2] = (int >> 8) & 0xff;
  bytes[3] = int & 0xff;
  return bytes;
}

h3Server.startServer();
runEchoServer(h3Server);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
