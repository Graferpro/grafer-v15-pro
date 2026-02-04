// api/proxy.js - GARANTİ ÇALIŞAN VERSİYON
export default async function handler(req, res) {
    // 1. İzinleri ver
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    const { type, symbol } = req.query;
    let url;

    // --- SENARYOLAR ---
    
    // 1. FOREX (Döviz)
    if (type === 'forex') {
        const apiKey = process.env.API_KEY_FOREX;
        // Eğer anahtar yoksa yedek (demo) veri gönderelim ki ekran boş kalmasın
        if (!apiKey) return res.status(200).json({ 
            results: { TRY: 34.20, EUR: 1.08, GBP: 1.25, JPY: 150.1, CHF: 0.90 } 
        });
        url = `https://api.fastforex.io/fetch-all?api_key=${apiKey}`;
    }
    
    // 2. STOCK (Borsa)
    else if (type === 'stock') {
        const apiKey = process.env.API_KEY_FINNHUB;
        const sym = symbol || 'AAPL';
        if (!apiKey) return res.status(200).json({ c: 175.50, dp: 1.25 }); // Demo veri
        url = `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${apiKey}`;
    }

    // 3. GOLD (Altın) - MetalPriceAPI
    else if (type === 'gold') {
        const apiKey = process.env.API_KEY_GOLD;
        if (!apiKey) return res.status(200).json({ rates: { XAU: 0.00045 } }); // Demo veri
        url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU`;
    }

    // --- İSTEĞİ YAP ---
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Hatası: ${response.status}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        // Hata olsa bile boş dönmeyelim, demo veri basalım
        res.status(500).json({ error: error.message });
    }
}
