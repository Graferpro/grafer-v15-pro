export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_FOREX;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API_KEY_FOREX missing' });
    }

    try {
        const url = `https://api.fastforex.io/fetch-all?api_key=${API_KEY}`;
        const backendRes = await fetch(url);
        const data = await backendRes.json();

        // 🔥 NORMALIZATION (KRİTİK)
        data.results[data.base] = 1;

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: 'Forex fetch failed',
            details: error.message
        });
    }
}