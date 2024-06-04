import React, { useEffect, useState } from "react";
import axios from "axios";

const SurveyResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("/api/survey");
        setResults(response.data);
      } catch (error) {
        console.error(
          "Es gab einen Fehler beim Abrufen der Umfrageergebnisse:",
          error
        );
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2>Umfrageergebnisse</h2>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};

export default SurveyResults;
