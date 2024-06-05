// getSurveyData.js
import surveyDE from "./survey-de.json";
import surveyEN from "./survey-en.json";

const getSurveyData = (locale) => {
  switch (locale) {
    case "de":
      return surveyDE;
    case "en":
      return surveyEN;
    default:
      return surveyDE;
  }
};

export default getSurveyData;
