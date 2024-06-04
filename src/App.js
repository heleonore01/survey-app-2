import React, { useState } from "react";
import SurveyForm from "./components/SurveyForm";
import SurveyResults from "./components/SurveyResults";

const App = () => {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
  };

  return (
    <div className="App">
      {!completed ? (
        <SurveyForm onComplete={handleComplete} />
      ) : (
        <SurveyResults />
      )}
    </div>
  );
};

export default App;
