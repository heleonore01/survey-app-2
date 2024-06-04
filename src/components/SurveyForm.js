import React from "react";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./override.css";
import { StylesManager, Model } from "survey-core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import surveyData from "./survey.json";

StylesManager.applyTheme("defaultV2");

const SurveyForm = () => {
  const navigate = useNavigate();
  const survey = new Model(surveyData);

  const handleComplete = async (survey) => {
    console.log("Survey data:", survey.data);

    try {
      await axios.post("http://lnx-007.khm.at/api/survey/", survey.data);
      // Redirect to the results page
      navigate("/");
    } catch (error) {
      console.error(
        "Es gab einen Fehler beim Speichern der Umfrageantworten:",
        error
      );
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
