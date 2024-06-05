import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js"; // Import Chart explicitly
import "chart.js/auto";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import translations from "./resultsTranslation";

// Set default font color globally
Chart.defaults.color = "#B6D2C3"; // Use Chart.defaults.color instead of Chart.defaults.global.defaultFontColor for Chart.js v3 and higher

const backgroundColorPlugin = {
  id: "backgroundColorPlugin",
  beforeDraw: (chart) => {
    const {
      ctx,
      chartArea: { left, right },
      scales: { y },
    } = chart;
    ctx.save();

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      ctx.fillStyle = "#2F4F4F"; // Dark background color for each bar

      chart.getDatasetMeta(datasetIndex).data.forEach((bar, index) => {
        const { x, y: barY, width, height } = bar;
        const radius = 5; // Radius for rounded corners
        ctx.beginPath();
        ctx.moveTo(left + radius, barY - height / 2);
        ctx.lineTo(right - radius, barY - height / 2);
        ctx.quadraticCurveTo(
          right,
          barY - height / 2,
          right,
          barY - height / 2 + radius
        );
        ctx.lineTo(right, barY + height / 2 - radius);
        ctx.quadraticCurveTo(
          right,
          barY + height / 2,
          right - radius,
          barY + height / 2
        );
        ctx.lineTo(left + radius, barY + height / 2);
        ctx.quadraticCurveTo(
          left,
          barY + height / 2,
          left,
          barY + height / 2 - radius
        );
        ctx.lineTo(left, barY - height / 2 + radius);
        ctx.quadraticCurveTo(
          left,
          barY - height / 2,
          left + radius,
          barY - height / 2
        );
        ctx.fill();
      });
    });

    ctx.restore();
  },
};

const SurveyResults = ({ locale, toggleLocale }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const t = translations[locale];

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

    for (const [key, text] of Object.entries(counts)) {
      labels.push(key);
      counts[key] = text;
    }

    const maxCount = Math.max(...Object.values(counts));
    const mostFrequentResponse = Object.keys(counts).find(
      (key) => counts[key] === maxCount
    );

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
          borderRadius: 5, // Rounded bars
          barPercentage: 0.5, // Adjust bar thickness
        },
      ],
      mostFrequentResponse: {
        response: mostFrequentResponse,
        count: maxCount,
      },
    };
  };

  const horizontalOptions = {
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
          font: {
            size: 14,
            weight: "bold",
            color: "#FFF", // Color for X-axis labels (change to desired color)
          },
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
            color: "#FFF", // Color for Y-axis labels (change to desired color)
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    devicePixelRatio: 2, // Increase pixel ratio for better rendering quality
  };

  const verticalOptions = {
    indexAxis: "x", // This makes the bars horizontal
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
          font: {
            size: 14,
            weight: "bold",
            color: "#FFF", // Color for X-axis labels (change to desired color)
          },
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
            color: "#FFF", // Color for Y-axis labels (change to desired color)
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    devicePixelRatio: 2, // Increase pixel ratio for better rendering quality
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
    <div>
      <div className="results-container">
        <Row className="charts-container">
          <Col>
            <Row>
              <Col>
                <div>
                  <div className="chart-element">
                    <div className="chart-headline">
                      <h3>
                        {ageDistributionData.mostFrequentResponse.count}{" "}
                        {t.ageDistribution}{" "}
                        <span className="pink">
                          {ageDistributionData.mostFrequentResponse.response}
                        </span>
                      </h3>
                      <h2>{t.ageDistribution2}</h2>
                    </div>
                    <div>
                      <Bar
                        data={lookFeelingsData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                  <div className="chart-element">
                    <h3>
                      {heightDistributionData.mostFrequentResponse.count}{" "}
                      {t.heightDistribution}{" "}
                      <span className="pink">
                        {heightDistributionData.mostFrequentResponse.response}
                      </span>
                      {t.heightDistribution2}{" "}
                    </h3>
                    <div>
                      <Bar
                        data={heightDistributionData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                  <div className="chart-element">
                    <h3>
                      {genderDistributionData.mostFrequentResponse.count}{" "}
                      {t.heightDistribution}{" "}
                      <span className="pink">
                        {genderDistributionData.mostFrequentResponse.response}
                      </span>
                    </h3>
                    <div>
                      <Bar
                        data={genderDistributionData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col>
                <div>
                  <div className="chart-element">
                    <h3>{t.friendRequestChoice}</h3>
                    <h2>{t.friendRequestChoice2}</h2>
                    <div>
                      <Bar
                        data={friendRequestChoiceData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="chart-element">
                    <h3>
                      {lookFeelingsData.mostFrequentResponse.count}{" "}
                      {t.participantsFeel}{" "}
                      {lookFeelingsData.mostFrequentResponse.response}
                    </h3>
                    <div>
                      <Bar
                        data={lookFeelingsData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Row className="satisfaction-container">
            <Col>
              <div className="satisfaction-chart-element">
                <h3>
                  {exhibitionSatisfactionData.mostFrequentResponse.count}{" "}
                  {t.participantsFeel}{" "}
                  {exhibitionSatisfactionData.mostFrequentResponse.response}
                </h3>
                <div>
                  <Bar
                    data={exhibitionSatisfactionData}
                    options={verticalOptions}
                  />
                </div>
              </div>
            </Col>
            <Col>
              <div className="satisfaction-chart-element">
                <h3>
                  {exhibitionReflectionData.mostFrequentResponse.count}{" "}
                  {t.participantsFeel}{" "}
                  {exhibitionReflectionData.mostFrequentResponse.response}
                </h3>
                <div>
                  <Bar
                    data={exhibitionReflectionData}
                    options={verticalOptions}
                  />
                </div>
              </div>
            </Col>
            <Col>
              <div className="satisfaction-chart-element">
                <h3>
                  {emotionalImpactData.mostFrequentResponse.count}{" "}
                  {t.participantsFeel}{" "}
                  {emotionalImpactData.mostFrequentResponse.response}
                </h3>
                <div>
                  <Bar data={emotionalImpactData} options={verticalOptions} />
                </div>
              </div>
            </Col>
          </Row>
        </Row>
        <Row>
          <div className="start-nav">
            <div className="language-switcher">
              <span
                className={locale === "de" ? "active" : ""}
                onClick={() => locale !== "de" && toggleLocale()}
              >
                DE
              </span>
              <span> | </span>
              <span
                className={locale === "en" ? "active" : ""}
                onClick={() => locale !== "en" && toggleLocale()}
              >
                EN
              </span>
            </div>
            <button onClick={() => navigate("/survey")}>{t.startSurvey}</button>
          </div>{" "}
        </Row>
      </div>
    </div>
  );
};

export default SurveyResults;
