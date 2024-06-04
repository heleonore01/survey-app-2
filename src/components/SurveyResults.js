import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

// Plugin to draw a background color extending to 100%
const backgroundColorPlugin = {
  id: "backgroundColorPlugin",
  beforeDraw: (chart) => {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    ctx.save();
    ctx.fillStyle = "#2F4F4F"; // Dark background color
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.right - chartArea.left,
      chartArea.bottom - chartArea.top
    );
    ctx.restore();
  },
};

const SurveyResults = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/survey"); // Use relative path
        setData(response.data);
      } catch (err) {
        setError("Error fetching survey results");
        console.error("Error fetching survey results:", err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const processData = (questionKey) => {
    const labels = [];
    const counts = {};

    data.forEach((response) => {
      const answer = response[questionKey];
      if (answer) {
        counts[answer] = (counts[answer] || 0) + 1;
      }
    });

    for (const [key, value] of Object.entries(counts)) {
      labels.push(key);
      counts[key] = value;
    }

    const maxCount = Math.max(...Object.values(counts));
    const backgroundColors = labels.map((label) =>
      counts[label] === maxCount ? "#EA87AB" : "#5CF675"
    );

    return {
      labels: labels,
      datasets: [
        {
          label: "Number of Responses",
          data: Object.values(counts),
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
          borderRadius: 20, // Rounded bars
          barPercentage: 0.5, // Adjust bar thickness
        },
      ],
    };
  };

  const barOptions = {
    indexAxis: "y", // This makes the bars horizontal
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Remove grid lines
        },
        ticks: {
          display: false, // Remove ticks
        },
      },
      y: {
        grid: {
          display: false, // Remove grid lines
        },
        ticks: {
          font: {
            size: 14,
            weight: "bold",
            color: "#FFFFFF", // Label color
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
  };

  // Define chart data
  const ageDistributionData = processData("question1-age");
  const heightDistributionData = processData("question2-height");
  const genderDistributionData = processData("question3-gender");
  const lookFeelingsData = processData("question4-look");
  const friendRequestChoiceData = processData("question5-friendrequest");
  const exhibitionSatisfactionData = processData("exhibition1-satisfaction");
  const exhibitionReflectionData = processData("exhibition2-reflection");
  const emotionalImpactData = processData("exhibition3-touched-emotion");

  return (
    <div className="results-container">
      <div className="demographics-container">
        <div>
          <h3>Age Distribution</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Bar
              data={ageDistributionData}
              options={barOptions}
              plugins={[backgroundColorPlugin]}
            />
          </div>
        </div>
        <div>
          <h3>Height Distribution</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Bar
              data={heightDistributionData}
              options={barOptions}
              plugins={[backgroundColorPlugin]}
            />
          </div>
        </div>
        <div>
          <h3>Gender Distribution</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Bar
              data={genderDistributionData}
              options={barOptions}
              plugins={[backgroundColorPlugin]}
            />
          </div>
        </div>
      </div>
      <div className="feelings-container">
        <div>
          <h3>Feelings when Looked At</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Bar
              data={lookFeelingsData}
              options={barOptions}
              plugins={[backgroundColorPlugin]}
            />
          </div>
        </div>
      </div>
      <div className="friend-container">
        <div>
          <h3>Friend Request Choice</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Bar
              data={friendRequestChoiceData}
              options={barOptions}
              plugins={[backgroundColorPlugin]}
            />
          </div>
        </div>
      </div>
      <div className="exhibition-container">
        <div>
          <h3>Exhibition Satisfaction</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Pie data={exhibitionSatisfactionData} />
          </div>
        </div>
        <div>
          <h3>Exhibition Reflection</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Pie data={exhibitionReflectionData} />
          </div>
        </div>
        <div>
          <h3>Emotional Impact</h3>
          <div style={{ width: "100%", height: "300px" }}>
            <Pie data={emotionalImpactData} />
          </div>
        </div>
      </div>
      <button onClick={() => navigate("/survey")}>Starte die Umfrage</button>
    </div>
  );
};

export default SurveyResults;
