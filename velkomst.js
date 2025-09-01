const fetch = require("node-fetch");
require("dotenv").config();
const fs = require("fs");

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const WEATHER_KEY = process.env.OPENWEATHER_API_KEY;
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.VOICE_ID;

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Førde,no&appid=${WEATHER_KEY}&units=metric&lang=no`;
  const res = await fetch(url);
  const data = await res.json();
  return `${data.weather[0].description} ${Math.round(data.main.temp)}°C`;
}

async function generateText() {
  const weather = await getWeather();
  return `Velkommen heim! Vêret i dag er ${weather}`;
}

async function generateTTS(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVEN_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model_id: "eleven_multilingual_v3",
      text,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 }
    })
  });

  const buffer = await res.buffer();
  fs.writeFileSync("velkomst.mp3", buffer);
  console.log("Laga velkomst.mp3");
}

(async () => {
  const text = await generateText();
  await generateTTS(text);
})();
