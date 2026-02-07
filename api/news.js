// /api/news.js
export default async function handler(request, response) {
    // Finnhub Anahtarını kullanıyoruz (Zaten sende ekli)
    const API_KEY = process.env.API_KEY_FINNHUB;

    if (!API_KEY) {
        return response.status(500).json({ error: 'Finnhub API Anahtarı bulunamadı!' });
    }

    try {
        // Finnhub'dan "General Market News" (Genel Piyasa Haberleri) çekiyoruz
        const url = `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        // Gelen veri çok karışık olabilir, sadece son 7 başlığı alalım
        // Haberler İngilizce gelir, bu yüzden olduğu gibi gönderiyoruz.
        const headlines = data.slice(0, 7).map(news => news.headline);

        return response.status(200).json({ news: headlines });

    } catch (error) {
        return response.status(500).json({ error: 'Haberler alınamadı', details: error.message });
    }
}
