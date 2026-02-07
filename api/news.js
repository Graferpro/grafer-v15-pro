export default async function handler(request, response) {
    const API_KEY = process.env.API_KEY_FINNHUB;

    if (!API_KEY) {
        return response.status(500).json({ error: 'Finnhub API Anahtarı bulunamadı!' });
    }

    try {
        const url = `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        // ARTIK HEM BAŞLIK HEM DE LİNK ALIYORUZ
        const newsItems = data.slice(0, 10).map(news => ({
            text: news.headline,
            url: news.url
        }));

        return response.status(200).json({ news: newsItems });

    } catch (error) {
        return response.status(500).json({ error: 'Haberler alınamadı', details: error.message });
    }
}
