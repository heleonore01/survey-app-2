import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const SurveyResults = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://lnx-007.khm.at/api/survey/results"
        );
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

    return {
      labels: labels,
      datasets: [
        {
          label: "Number of Responses",
          data: Object.values(counts),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const questions = [
    { key: "question1-age", title: "Age Distribution" },
    { key: "question2-height", title: "Height Distribution" },
    { key: "question3-gender", title: "Gender Distribution" },
    { key: "question4-look", title: "Feelings when Looked At" },
    { key: "question5-friendrequest", title: "Friend Request Choice" },
    { key: "exhibition1-satisfaction", title: "Exhibition Satisfaction" },
    { key: "exhibition2-reflection", title: "Exhibition Reflection" },
    { key: "exhibition3-touched-emotion", title: "Emotional Impact" },
  ];

  return (
    <div>
      <button onClick={() => navigate("/survey")}>Starte die Umfrage</button>
      {questions.map((question) => (
        <div key={question.key}>
          <h3>{question.title}</h3>
          {question.key.startsWith("exhibition") ? (
            <Pie data={processData(question.key)} />
          ) : (
            <Bar data={processData(question.key)} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SurveyResults;
