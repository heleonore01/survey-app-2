// RadiogroupWithImageQuestion.jsx
import React from "react";
import { SurveyQuestionRadiogroup } from "survey-react-ui";

class RadiogroupWithImageQuestion extends SurveyQuestionRadiogroup {
  render() {
    const imageUrl = this.question.imageLink;
    return (
      <div>
        {imageUrl && (
          <div className="custom-image">
            <img
              src={imageUrl}
              alt="question"
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        )}
        {super.render()}
      </div>
    );
  }
}

export default RadiogroupWithImageQuestion;
