let wsAvgResponseTime = 0;
document.getElementById("websocket").onclick = async () => {
  const timesArray = [];
  for (let i = 0; i < 10; i++) {
    await wsTest(i, timesArray);
  }
  averageResults(timesArray, WEBSOCKET_DATASET);
  console.log(
    "The average response time after receiving 5000 messages was: " +
      wsAvgResponseTime / 10 +
      " ms"
  );
};

function wsTest(index, timesArray) {
  return new Promise((resolve) => {
    timesArray.push([]);
    let messageRecievedCount = 0;
    let t0 = performance.now();
    let socket = io(":3000", { transports: ["websocket"] });

    socket.on("connect", async () => {
      console.info(`Connection established in ${performance.now() - t0} ms.`);
      t0 = performance.now();
      chart.data.datasets[0].data.push({
        x: performance.now() - t0,
        y: messageRecievedCount,
      });
      timesArray[index].push({
        y: messageRecievedCount,
        x: performance.now() - t0,
      });
    });

    socket.on("message", () => {
      messageRecievedCount++;
      timesArray[index].push({
        y: messageRecievedCount,
        x: performance.now() - t0,
      });
      if (performance.now() - t0 - chart.data.datasets[0].data.at(-1).x > 200) {
        chart.data.datasets[0].data.push({
          x: performance.now() - t0,
          y: messageRecievedCount,
        });
        chart.update();
      }
    });

    socket.on("disconnect", () => {
      console.info(
        `${messageRecievedCount} message(s) were sent and received in ${
          performance.now() - t0
        } ms.`
      );
      timesArray[index].push({
        y: messageRecievedCount,
        x: performance.now() - t0,
      });
      wsAvgResponseTime += performance.now() - t0;
      resolve();
    });
  });
}

function MultiplexTest() {
  let chat = io(":3000/chat");
  let game = io(":3000/game");

  chat.on("message", (msg) => {
    console.log("chat: " + msg);
  });

  game.on("message", (msg) => {
    console.log("game: " + msg);
  });
}
