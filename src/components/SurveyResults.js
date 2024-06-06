import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import translations from "./resultsTranslation";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js"; // Import Chart explicitly
import "./override.css";
import "chart.js/auto";
import getSurveyData from "./data/surveyData";
import { backgroundColorPlugin } from "./chartPlugins"; // Import the plugin
import { horizontalOptions, verticalOptions } from "./chartOptions"; // Import the options

Chart.defaults.color = "#B6D2C3"; // Use Chart.defaults.color instead of Chart.defaults.global.defaultFontColor for Chart.js v3 and higher

const SurveyResults = ({ locale, toggleLocale }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const t = translations[locale];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/survey");
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

  const surveyData = getSurveyData(locale);

  const getLabelText = (questionName, value) => {
    const question = surveyData.pages
      .flatMap((page) => page.elements)
      .find((element) => element.name === questionName);

    if (question && question.choices) {
      const choice = question.choices.find((choice) => choice.value === value);
      return choice ? choice.text : value;
    }
    return value;
  };

  const processData = (questionKey, allPossibleLabels = []) => {
    const counts = {};

    allPossibleLabels.forEach((label) => {
      counts[label] = 0;
    });

    data.forEach((response) => {
      const answer = response[questionKey];
      if (answer) {
        counts[answer] = (counts[answer] || 0) + 1;
      }
    });

    const labels = Object.keys(counts).map((value) =>
      getLabelText(questionKey, value)
    );
    const values = Object.values(counts);

    const maxCount = Math.max(...values);
    const mostFrequentResponse = labels[values.indexOf(maxCount)];

    const backgroundColors = labels.map((label, index) =>
      values[index] === maxCount ? "#EA87AB" : "#5CF675"
    );

    return {
      labels: labels,
      datasets: [
        {
          label: "Number of Responses",
          data: values,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 0,
          borderRadius: 5,
          barPercentage: 1,
        },
      ],
      mostFrequentResponse: {
        response: mostFrequentResponse,
        count: maxCount,
      },
    };
  };

  const getImageLink = (name) => {
    const friendQuestion = surveyData.pages
      .find((page) => page.name === "friend")
      .elements.find((el) => el.name === "question5-friendrequest");

    if (friendQuestion && friendQuestion.choices) {
      const choice = friendQuestion.choices.find(
        (choice) => choice.text === name
      );
      return choice ? choice.imageLink : "";
    }
    return "";
  };

  const allPossibleLabels = {
    "question1-age": ["<20", "20-39", "40-59", "60<"],
    "question2-height": ["<149", "150-169", "170-189", "190<"],
    "question3-gender": ["Female", "Male", "Diverse"],
    "question4-look": ["confident", "flattered", "nervous", "neutral"],
    "question5-friendrequest": [
      "Madeleine Gonzalez",
      "Anton Frank",
      "Elisabeth Stulta",
      "Disabled Man",
    ],
    "exhibition1-satisfaction": ["1", "2", "3", "4", "5"],
    "exhibition2-reflection": ["1", "2", "3", "4", "5"],
    "exhibition3-touched-emotion": ["1", "2", "3", "4", "5"],
  };

  const ageDistributionData = processData(
    "question1-age",
    allPossibleLabels["question1-age"]
  );
  const heightDistributionData = processData(
    "question2-height",
    allPossibleLabels["question2-height"]
  );
  const genderDistributionData = processData(
    "question3-gender",
    allPossibleLabels["question3-gender"]
  );
  const lookFeelingsData = processData(
    "question4-look",
    allPossibleLabels["question4-look"]
  );
  const friendRequestChoiceData = processData(
    "question5-friendrequest",
    allPossibleLabels["question5-friendrequest"]
  );
  const exhibitionSatisfactionData = processData(
    "exhibition1-satisfaction",
    allPossibleLabels["exhibition1-satisfaction"]
  );
  const exhibitionReflectionData = processData(
    "exhibition2-reflection",
    allPossibleLabels["exhibition2-reflection"]
  );
  const emotionalImpactData = processData(
    "exhibition3-touched-emotion",
    allPossibleLabels["exhibition3-touched-emotion"]
  );
  return (
    <div>
      <div className="results-container">
        <Row className="charts-container">
          <Col>
            <Row>
              <Col>
                <div>
                  <div className="chart-element border-bottom">
                    <Col xs={4} className="chart-headline">
                      <h3>
                        {ageDistributionData.mostFrequentResponse.count}{" "}
                        {t.ageDistribution}{" "}
                        <span className="pink">
                          {ageDistributionData.mostFrequentResponse.response}
                        </span>
                      </h3>
                      <h2 className="satisfaction-chart-subtitles">
                        {t.ageDistribution2}
                      </h2>
                    </Col>
                    <div>
                      <Bar
                        data={ageDistributionData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                  <div className="chart-element border-bottom">
                    <Col xs={4} className="chart-headline">
                      <h3>
                        {heightDistributionData.mostFrequentResponse.count}{" "}
                        {t.heightDistribution}{" "}
                        <span className="pink">
                          {heightDistributionData.mostFrequentResponse.response}
                        </span>
                        {t.heightDistribution2}{" "}
                      </h3>
                    </Col>
                    <div>
                      <Bar
                        data={heightDistributionData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                  <div className="chart-element border-bottom">
                    {" "}
                    <Col xs={4} className="chart-headline">
                      <h3>
                        {genderDistributionData.mostFrequentResponse.count}{" "}
                        {t.heightDistribution}{" "}
                        <span className="pink">
                          {genderDistributionData.mostFrequentResponse.response}
                        </span>
                      </h3>
                    </Col>
                    <div>
                      <Bar
                        data={genderDistributionData}
                        options={horizontalOptions}
                        plugins={[backgroundColorPlugin]}
                      />
                    </div>
                  </div>
                </div>{" "}
                <Row>
                  <h3> {t.satisfactionTitle} </h3>
                  <Row className="satisfaction-container chart-element">
                    <Col xs={4}>
                      <div className="satisfaction-chart-element">
                        <div className="border-bottom">
                          <Bar
                            data={exhibitionSatisfactionData}
                            options={verticalOptions}
                          />
                        </div>{" "}
                        <h2 className="satisfaction-chart-subtitles">
                          {" "}
                          {t.exhibitionSatisfactionChart1}{" "}
                        </h2>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="satisfaction-chart-element">
                        <div className="border-bottom">
                          <Bar
                            data={exhibitionReflectionData}
                            options={verticalOptions}
                          />
                        </div>{" "}
                        <h2 className="satisfaction-chart-subtitles">
                          {" "}
                          {t.exhibitionSatisfactionChart2}{" "}
                        </h2>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="satisfaction-chart-element">
                        <div className="border-bottom">
                          <Bar
                            data={emotionalImpactData}
                            options={verticalOptions}
                          />
                        </div>{" "}
                        <h2 className="satisfaction-chart-subtitles">
                          {" "}
                          {t.exhibitionSatisfactionChart3}{" "}
                        </h2>
                      </div>
                    </Col>
                  </Row>
                </Row>
              </Col>
              <Col xs={4} className="border-bottom">
                <div>
                  <div className="chart-element friend-request">
                    <div className="chart-headline">
                      {" "}
                      <h3>{t.friendRequestChoice}</h3>
                      <h3>
                        <span className="pink">
                          {" "}
                          {
                            friendRequestChoiceData.mostFrequentResponse
                              .response
                          }
                        </span>
                      </h3>{" "}
                    </div>
                    <h3>{t.friendRequestChoice2}</h3>
                    <div>
                      <img
                        src={getImageLink(
                          friendRequestChoiceData.mostFrequentResponse.response
                        )}
                        alt={
                          friendRequestChoiceData.mostFrequentResponse.response
                        }
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
