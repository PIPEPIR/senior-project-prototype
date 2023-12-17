const mockData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Predicted",
      data: [3600, 3200, 3500, 3200, 5500, 12900], // Rounded predicted data
      fill: false,
      borderColor: "orange",
      tension: 0.1,
      borderDash: [5, 5] // Dashed line for predicted data
    },
    {
      label: "Actual",
      data: [2500, 4000, 3000, 3100, 6000, 14000], // Rounded actual data
      fill: false,
      borderColor: "grey",
      tension: 0.1
    }
  ],
};


// Initialize the Chart.js graph
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

// Modify the getMockPrediction function to use input values
function getMockPrediction(rainfall, temperature) {
  const predictionBase = mockData.datasets[1].data.slice(-1)[0];
  const rainfallEffect = rainfall * 0.1;
  const temperatureEffect = temperature * 0.2;
  return predictionBase + rainfallEffect + temperatureEffect;
}

// Function to update the chart with a new predicted value for the next month
function addCustomPredictionToChart(chart, prediction) {
  // Determine the next month and date
  const lastLabel = chart.data.labels[chart.data.labels.length - 1];
  const lastMonth = new Date(lastLabel + " 1, 2023"); // Year is arbitrary, added day for parsing
  const nextMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() + 1));
  const nextMonthLabel = nextMonth.toLocaleString('en-us', { month: 'short' });

  // Add the next month to the labels
  chart.data.labels.push(nextMonthLabel);

  // Update the "Predicted" dataset
  chart.data.datasets.forEach((dataset) => {
    if (dataset.label === "Predicted") {
      dataset.data.push(prediction);
    } else {
      // For other datasets (like "Actual"), push null or handle as needed
      dataset.data.push(null);
    }
  });

  // Refresh the chart to show the new data
  chart.update();
}


// Event listener for the predict button
document.getElementById("predictBtn").addEventListener("click", () => {
  const rainfall = parseFloat(document.getElementById("rainfall").value);
  const temperature = parseFloat(document.getElementById("temperature").value);

  // Validate the input
  if (isNaN(rainfall) || isNaN(temperature)) {
    alert("Please enter valid numbers for rainfall and temperature.");
    return;
  }

  const predictedValue = getMockPrediction(rainfall, temperature);
  addCustomPredictionToChart(resultsGraph, predictedValue);

  // Update the "Predicted Case" display
  document.getElementById("predictedCase").textContent = `${Math.round(predictedValue)} people`;

  document.getElementById("graphSection").style.display = "block";
  document.getElementById("inputSection").style.display = "none";
});