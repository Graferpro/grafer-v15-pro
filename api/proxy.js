import fetch from 'node-fetch';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Vercel ayarlarından anahtarı al
    const API_KEY = process.env.API_KEY_FOREX;

    if (!API_KEY) {
        return res.status(500).json({ error: "Sunucuda API Anahtarı bulunamadı!" });
    }

    try {
        const url = `https://api.fastforex.io/fetch-all?api_key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Dış API Hatası: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
