export default async function handler(req, res) {
  // CORS ayarları: Frontend'den gelen istekleri kabul et
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { type, symbol } = req.query;

  // Vercel paneline gireceğin gizli anahtarlar burada isimle çağrılıyor
  const KEYS = {
    forex: process.env.API_KEY_FOREX,
    gold: process.env.API_KEY_GOLD,
    finnhub: process.env.API_KEY_FINNHUB
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
    }

    const response = await fetch(url, { headers });
    const data = await response.json();
    
    // Veriyi güvenli bir şekilde senin uygulamana gönderir
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Veri çekme sırasında hata oluştu kanka!" });
  }
}
