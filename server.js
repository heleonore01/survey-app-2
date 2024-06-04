const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors"); // Importiere das cors Paket

const app = express();
const port = 5001; // Verwende den korrekten Port

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Verwende das cors Paket
app.use(express.static(path.join(__dirname, "public")));

// SQLite Datenbank einrichten
const db = new sqlite3.Database(":memory:");

// Tabelle erstellen
db.serialize(() => {
  db.run("CREATE TABLE survey_results (id INTEGER PRIMARY KEY, data TEXT)");
});

// Endpunkt zum Speichern der Umfrageergebnisse
app.post("/api/survey", (req, res) => {
  const data = JSON.stringify(req.body);
  console.log("Empfangene Daten:", data); // Logge die empfangenen Daten
  db.run(
    "INSERT INTO survey_results (data) VALUES (?)",
    [data],
    function (err) {
      if (err) {
        console.error("Fehler beim Einfügen der Daten:", err.message);
        return res.status(500).send(err.message);
      }
      res.status(200).send({ id: this.lastID });
    }
  );
});

// Endpunkt zum Abrufen der Umfrageergebnisse
app.get("/api/survey", (req, res) => {
  db.all("SELECT * FROM survey_results", (err, rows) => {
    if (err) {
      console.error("Fehler beim Abrufen der Daten:", err.message);
      return res.status(500).send(err.message);
    }
    res.status(200).json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
