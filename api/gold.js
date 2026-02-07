export default async function handler(request, response) {
    const API_KEY = process.env.API_KEY_GOLD;

    if (!API_KEY) {
        return response.status(500).json({ error: 'Gold API Anahtarı bulunamadı!' });
    }

    try {
        // GoldAPI.io üzerinden verileri çekiyoruz
        const goldReq = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: { 'x-access-token': API_KEY, 'Content-Type': 'application/json' }
        });
        const silverReq = await fetch('https://www.goldapi.io/api/XAG/USD', {
            headers: { 'x-access-token': API_KEY, 'Content-Type': 'application/json' }
        });

        const goldData = await goldReq.json();
        const silverData = await silverReq.json();

        // Eğer API hata veya limit uyarısı dönerse kontrol edelim
        if (goldData.error || silverData.error) {
             throw new Error(goldData.error || silverData.error);
        }

        return response.status(200).json({
            XAU: goldData.price, 
            XAG: silverData.price 
        });

    } catch (error) {
        // Hata durumunda frontend'in çökmemesi için null dönüyoruz,
        // app.js'deki manuel fiyatlar devreye girecek.
        return response.status(500).json({ error: 'Altın verisi çekilemedi', details: error.message });
    }
}
