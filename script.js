const mockData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Predicted",
      data: [3600, 3200, 3500, 3200, 5500, 12900], 
      fill: false,
      borderColor: "orange",
      tension: 0.1,
      borderDash: [5, 5]
    },
    {
      label: "Actual",
      data: [2500, 4000, 3000, 3100, 6000, 14000], 
      fill: false,
      borderColor: "grey",
      tension: 0.1
    }
  ],
};



const ctx = document.getElementById("resultsGraph").getContext("2d");
const resultsGraph = new Chart(ctx, {
  type: "line",
  data: mockData,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    animation: {
      duration: 500,
    },
  },
});


function getMockPrediction(rainfall, temperature) {

  return  Math.random() * (14000 - 2000) + 2000;;
}

function addCustomPredictionToChart(chart, prediction) {
  const lastLabel = chart.data.labels[chart.data.labels.length - 1];
  const lastMonth = new Date(lastLabel + " 1, 2023"); 
  const nextMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() + 1));
  const nextMonthLabel = nextMonth.toLocaleString('en-us', { month: 'short' });

  chart.data.labels.push(nextMonthLabel);

  chart.data.datasets.forEach((dataset) => {
    if (dataset.label === "Predicted") {
      dataset.data.push(prediction);
    } else {
      dataset.data.push(null);
    }
  });

  chart.update();
}



document.getElementById("predictBtn").addEventListener("click", () => {
  const rainfall = parseFloat(document.getElementById("rainfall").value);
  const temperature = parseFloat(document.getElementById("temperature").value);


  if (isNaN(rainfall) || isNaN(temperature)) {
    alert("Please enter valid numbers for rainfall and temperature.");
    return;
  }

  const predictedValue = getMockPrediction(rainfall, temperature);
  addCustomPredictionToChart(resultsGraph, predictedValue);

 
  document.getElementById("predictedCase").textContent = `${Math.round(predictedValue)} people`;

  document.getElementById("graphSection").style.display = "block";
  document.getElementById("inputSection").style.display = "none";
});