import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SurveyForm from "./components/SurveyForm";
import SurveyResults from "./components/SurveyResults";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/survey" element={<SurveyForm />} />
        <Route path="/" element={<SurveyResults />} />
      </Routes>
    </Router>
  );
};

export default App;
