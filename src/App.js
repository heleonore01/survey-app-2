import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SurveyForm from "./components/SurveyForm";
import SurveyResults from "./components/SurveyResults";
import "./components/override.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [locale, setLocale] = useState("de"); // Default to German

  const toggleLocale = () => {
    setLocale((prevLocale) => (prevLocale === "en" ? "de" : "en"));
  };

  return (
    <Router>
      <Routes>
        <Route path="/survey" element={<SurveyForm locale={locale} />} />
        <Route
          path="/results"
          element={
            <SurveyResults locale={locale} toggleLocale={toggleLocale} />
          }
        />
        {/* Redirect from root path to /results */}
        <Route path="/" element={<Navigate to="/results" />} />
      </Routes>
    </Router>
  );
};

export default App;
