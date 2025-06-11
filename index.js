
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: "Aucun prompt fourni" });
  }

  try {
    const response = await axios.post(
      `https://generativeai.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    res.json({ text });
  } catch (error) {
    console.error("Erreur Gemini:", error.message);
    res.status(500).json({ error: "Erreur Gemini", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Serveur Gemini en ligne sur le port", PORT);
});
