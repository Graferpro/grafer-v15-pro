
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { type, symbol, lat, lon } = req.query;

  // Vercel Environment Variables
  const KEYS = {
    forex: process.env.API_KEY_FOREX,
    gold: process.env.API_KEY_GOLD,
    finnhub: process.env.API_KEY_FINNHUB,
    weather: process.env.API_KEY_WEATHER // YENİ EKLENDİ
  };

  try {
    let url = "";
    let headers = {};

    if (type === "forex") {
      url = `https://api.fastforex.io/fetch-all?from=USD&api_key=${KEYS.forex}`;
    } else if (type === "gold") {
      url = `https://www.goldapi.io/api/${symbol}/USD`;
      headers = { "x-access-token": KEYS.gold };
    } else if (type === "stock") {
      url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${KEYS.finnhub}`;
    } else if (type === "weather") {
      // OpenWeatherMap API
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${KEYS.weather}`;
    }

    const response = await fetch(url, { headers });
    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Veri çekilemedi" });
  }
}
