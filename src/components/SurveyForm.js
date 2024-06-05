import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./override.css";
import { StylesManager, Model } from "survey-core";
import axios from "axios";
import getSurveyData from "./surveyData";

StylesManager.applyTheme("defaultV2");

const SurveyForm = ({ onComplete, locale }) => {
  const [surveyData, setSurveyData] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setSurveyData(getSurveyData(locale));
  }, [locale]);

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  const survey = new Model(surveyData);

  const handleComplete = async (survey) => {
    console.log("Survey data:", survey.data);

    try {
      await axios.post("http://lnx-007.khm.at/api/survey/", survey.data);
      navigate("/results"); // Redirect to results page
    } catch (error) {
      console.error("There was an error saving the survey responses:", error);
    }
  };

  survey.onComplete.add(handleComplete);

  return (
    <div className="survey-container">
      <div className="survey-content">
        <Survey model={survey} />
      </div>
    </div>
  );
};

export default SurveyForm;
