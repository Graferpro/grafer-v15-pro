import fetch from 'node-fetch';

export default async function handler(req, res) {
    // İzinler (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    const { type, symbol } = req.query;
    let url;
    let apiKey;

    try {
        // 1. FOREX (Döviz) - FastForex
        if (type === 'forex') {
            apiKey = process.env.API_KEY_FOREX;
            if (!apiKey) throw new Error("Forex Anahtarı Eksik");
            url = `https://api.fastforex.io/fetch-all?api_key=${apiKey}`;
        }
        
        // 2. STOCK (Borsa) - Finnhub
        else if (type === 'stock') {
            apiKey = process.env.API_KEY_FINNHUB;
            if (!apiKey) throw new Error("Borsa Anahtarı Eksik");
            const sym = symbol || 'AAPL';
            url = `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${apiKey}`;
        }

        // 3. GOLD (Altın) - MetalPrice (Opsiyonel)
        else if (type === 'gold') {
            apiKey = process.env.API_KEY_GOLD;
            if (!apiKey) throw new Error("Altın Anahtarı Eksik");
            url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU`;
        }
        
        // --- İSTEĞİ YAP ---
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Hatası: ${response.status}`);
        const data = await response.json();

        res.status(200).json(data);

    } catch (error) {
        // Hata olsa bile JSON dön ki uygulama çökmesin
        res.status(500).json({ error: error.message });
    }
}
