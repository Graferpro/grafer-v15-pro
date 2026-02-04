import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Kanka buradan herkesin girişine izin veriyoruz (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    // İstekten ne istediğini öğrenelim (örn: ?type=gold)
    const { type, symbol } = req.query;
    let apiKey, url;

    // --- SENARYOLAR ---
    
    // 1. ALTIN FİYATLARI
    if (type === 'gold') {
        apiKey = process.env.API_KEY_GOLD;
        // MetalPriceAPI formatı (Örnek)
        url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU,XAG`;
    } 
    
    // 2. BORSA (Hisse Senedi)
    else if (type === 'stock') {
        apiKey = process.env.API_KEY_FINNHUB;
        const sym = symbol || 'AAPL'; // Sembol yoksa Apple getir
        url = `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${apiKey}`;
    }

    // 3. HAVA DURUMU
    else if (type === 'weather') {
        apiKey = process.env.API_KEY_WEATHER;
        const city = symbol || 'Istanbul';
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    }

    // 4. FOREX (Varsayılan - Dövizler)
    else {
        apiKey = process.env.API_KEY_FOREX;
        url = `https://api.fastforex.io/fetch-all?api_key=${apiKey}`;
    }

    // --- KONTROLLER ---

    if (!apiKey) {
        // Eğer anahtar yoksa kankamıza haber verelim
        return res.status(500).json({ error: `Kanka, '${type || 'Forex'}' için API anahtarı Vercel'de eksik!` });
    }

    try {
        // İsteği yapıyoruz
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Dış API Hatası: ${response.status}`);
        }

        const data = await response.json();
        
        // Veriyi paketleyip yolluyoruz
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
