// chartOptions.js
export const horizontalOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        display: false,
        font: {
          size: 14,
          weight: "bold",
          color: "#FFF",
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 14,
          weight: "bold",
          color: "#FFF",
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  devicePixelRatio: 2,
};

export const verticalOptions = {
  indexAxis: "x",
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        display: false,
        font: {
          size: 14,
          weight: "bold",
          color: "#FFF",
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 14,
          weight: "bold",
          color: "#FFF",
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  devicePixelRatio: 2,
};
