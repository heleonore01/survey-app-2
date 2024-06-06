import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./override.css";
import { StylesManager, Model } from "survey-core";
import axios from "axios";
import getSurveyData from "./data/surveyData";

StylesManager.applyTheme("defaultV2");

const preprocessSurveyData = (data) => {
  data.pages.forEach((page) => {
    const imageElementIndex = page.elements.findIndex(
      (el) => el.type === "image"
    );
    if (imageElementIndex > 0) {
      const [imageElement] = page.elements.splice(imageElementIndex, 1);
      page.elements.unshift(imageElement);
    }
  });
  return data;
};

const SurveyForm = ({ onComplete, locale }) => {
  const [surveyData, setSurveyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getSurveyData(locale);
    setSurveyData(preprocessSurveyData(data));
  }, [locale]);

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  const survey = new Model(surveyData);

  const handleComplete = async (survey) => {
    console.log("Survey data:", survey.data);

    try {
      await axios.post("http://lnx-007.khm.at/api/survey/", survey.data);
      navigate("/results");
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
