export default async function handler(req, res) {
    const { type, symbol, lat, lon } = req.query;

    // Vercel'e girdiğin isimlerle birebir aynı olmalı
    const API_KEYS = {
        forex: process.env.API_KEY_FOREX,
        gold: process.env.API_KEY_GOLD,
        finnhub: process.env.API_KEY_FINNHUB,
        weather: process.env.API_KEY_WEATHER
    };

    try {
        let url = "";
        let headers = {};

        if (type === "forex") {
            url = `https://api.fastforex.io/fetch-all?api_key=${API_KEYS.forex}`;
        } else if (type === "gold") {
            url = `https://www.goldapi.io/api/${symbol}/USD`;
            headers = { "x-access-token": API_KEYS.gold };
        } else if (type === "stock") {
            url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEYS.finnhub}`;
        } else if (type === "weather") {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${API_KEYS.weather}`;
        }

        const response = await fetch(url, { headers });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "API Bağlantı Hatası" });
    }
}
