export default async function handler(req, res) {
    // 1. İzinleri ver (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    // 2. Vercel ayarlarından şifreyi al
    const API_KEY = process.env.API_KEY_FOREX;

    // 3. Şifre yoksa hata ver
    if (!API_KEY) {
        return res.status(500).json({ error: "API Anahtarı Vercel ayarlarında eksik!" });
    }

    try {
        // 4. Veriyi dışarıdan çek
        const response = await fetch(`https://api.fastforex.io/fetch-all?api_key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`FastForex Hatası: ${response.status}`);
        }

        const data = await response.json();
        
        // 5. Veriyi bizim siteye yolla
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
