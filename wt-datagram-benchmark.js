document.getElementById("webtransport-datagram").onclick =
  async function webTransport() {
    let messageRecievedCount = 0;
    const transport = new WebTransport("https://127.0.0.1:3001/echo");

    await transport.ready;
    let t0 = performance.now();
    chart.data.datasets[2].data.push({
      y: messageRecievedCount,
      x: performance.now() - t0,
    });

    (async () => {
      const reader = await transport.datagrams.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        messageRecievedCount++;
        console.log(bytesToInt(value));
        if (
          performance.now() - t0 - chart.data.datasets[2].data.at(-1).x >
          200
        ) {
          chart.data.datasets[2].data.push({
            x: performance.now() - t0,
            y: messageRecievedCount,
          });
          chart.update();
        }
      }
    })();

    await transport.closed;
    console.info(
      `${messageRecievedCount} message(s) were received within ${
        performance.now() - t0
      } ms.`
    );
    chart.data.datasets[2].data.push({
      x: performance.now() - t0,
      y: messageRecievedCount,
    });
    chart.update();
  };

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateAverageResponseTime(sentTimes, receivedTimes) {
  let totalResponseTime = 0;

  for (let i = 0; i < sentTimes.length; i++) {
    if (receivedTimes[i] != 0 && receivedTimes[i] != undefined) {
      const sentTime = sentTimes[i];
      const receivedTime = receivedTimes[i];

      const responseTime = receivedTime.getTime() - sentTime.getTime();
      console.log(responseTime);
      totalResponseTime += responseTime;
    }
  }

  const averageResponseTime = totalResponseTime / messageRecievedCount;
  return averageResponseTime;
}

// Convert integer to bytes
function intToBytes(int) {
  const bytes = new Uint8Array(4); // Assuming 4 bytes for integer
  bytes[0] = (int >> 24) & 0xff;
  bytes[1] = (int >> 16) & 0xff;
  bytes[2] = (int >> 8) & 0xff;
  bytes[3] = int & 0xff;
  return bytes;
}

// Convert bytes to integer
function bytesToInt(bytes) {
  let int = 0;
  for (let i = 0; i < bytes.length; i++) {
    int |= bytes[i] << ((bytes.length - 1 - i) * 8);
  }
  return int;
}
