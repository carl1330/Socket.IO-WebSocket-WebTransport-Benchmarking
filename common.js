const chartContext = document.getElementById("chartCanvas");
const WEBSOCKET_DATASET = 0;
const WEBTRANSPORT_DATASET = 1;
const WEBTRANSPORT_DATAGRAMS_DATASET = 2;

let chart = new Chart(chartContext, {
  type: "scatter",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        label: "WebSocket",
        borderColor: "#4285F4",
        showLine: true,
      },
      {
        data: [],
        label: "WebTransport",
        borderColor: "#de5246",
        showLine: true,
        borderDash: [10, 5],
      },
      {
        data: [],
        label: "WebTransport Datagram",
        borderColor: "#34A853",
        showLine: true,
        borderDash: [2, 5],
      },
    ],
  },
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "time (ms)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Messages arrived",
        },
      },
    },
  },
});

function averageResults(array, dataset) {
  console.log(dataset);
  const resultDict = {};
  array.forEach((array) => {
    array.forEach(({ y: messageCount, x: timeReceived }) => {
      if (!resultDict[messageCount]) {
        resultDict[messageCount] = [];
      }
      resultDict[messageCount].push(timeReceived);
    });
  });

  const avgResults = [];
  for (const [messageCount, times] of Object.entries(resultDict)) {
    const avgTime = times.reduce((acc, cur) => acc + cur, 0) / times.length;
    avgResults.push({ y: parseInt(messageCount), x: avgTime });
  }

  console.log(avgResults);
  chart.data.datasets[dataset].data = avgResults;
  chart.update();
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
