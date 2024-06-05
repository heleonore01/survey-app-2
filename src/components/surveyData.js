import surveyDe from "./survey-de.json";
import surveyEn from "./survey-en.json";

const getSurveyData = (locale) => {
  switch (locale) {
    case "de":
      return surveyDe;
    case "en":
    default:
      return surveyEn;
  }
};

export default getSurveyData;
