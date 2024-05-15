document.getElementById("webtransport").onclick = async () => {
  const messagesReceivedTimes = [];
  for (let i = 0; i < 10; i++) {
    await runTest(i, messagesReceivedTimes);
  }
  averageResults(messagesReceivedTimes, WEBTRANSPORT_DATASET);
};

function runTest(index, messagesReceivedTimeTickArray) {
  return new Promise((resolve) => {
    let t0 = performance.now();
    let messageRecievedCount = 0;
    messagesReceivedTimeTickArray.push([]);
    const socket = io(":3002", {
      transportOptions: {
        webtransport: {
          hostname: "127.0.0.1",
        },
      },
      transports: ["webtransport"],
    });

    socket.on("connect", async () => {
      console.info(`Connection established in ${performance.now() - t0} ms.`);
      t0 = performance.now();
      messagesReceivedTimeTickArray[index].push({
        y: messageRecievedCount,
        x: performance.now() - t0,
      });
    });

    socket.on("message", () => {
      messageRecievedCount++;

      messagesReceivedTimeTickArray[index].push({
        y: messageRecievedCount,
        x: performance.now() - t0,
      });
    });

    socket.on("disconnect", () => {
      console.info(
        `${messageRecievedCount} message(s) were sent and received in ${
          performance.now() - t0
        } ms.`
      );
      resolve();
    });
  });
}

function MultiplexTest() {
  let chat = io(":3002/chat", {
    transportOptions: {
      webtransport: {
        hostname: "127.0.0.1",
      },
    },
    transports: ["webtransport"],
  });
  let game = io(":3002/chat", {
    transportOptions: {
      webtransport: {
        hostname: "127.0.0.1",
      },
    },
    transports: ["webtransport"],
  });

  chat.on("message", (msg) => {
    console.log("chat: " + msg);
  });

  game.on("message", (msg) => {
    console.log("game: " + msg);
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
