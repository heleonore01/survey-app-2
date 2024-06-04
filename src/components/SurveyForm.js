import React, { useState, useEffect } from "react";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./override.css";
import { StylesManager, Model } from "survey-core";
import axios from "axios";

// Importiere die JSON-Datei
import surveyData from "./survey.json";

StylesManager.applyTheme("defaultV2");

const SurveyForm = ({ onComplete }) => {
  const survey = new Model(surveyData);

  const handleComplete = async (survey) => {
    console.log("Survey data:", survey.data);

    try {
      await axios.post("http://lnx-007.khm.at/api/survey/", survey.data); //
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
