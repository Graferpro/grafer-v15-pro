export default async function handler(request, response) {
    // Vercel'den anahtarı alıyoruz (API_KEY_GOLD olarak kaydetmelisin)
    const API_KEY = process.env.API_KEY_GOLD;

    if (!API_KEY) {
        return response.status(500).json({ error: 'Gold API Anahtarı bulunamadı!' });
    }

    try {
        // Altın (XAU) ve Gümüş (XAG) için istek atıyoruz
        // Headers kısmı GoldAPI.io standartlarına göredir
        const goldReq = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: { 'x-access-token': API_KEY, 'Content-Type': 'application/json' }
        });
        const silverReq = await fetch('https://www.goldapi.io/api/XAG/USD', {
            headers: { 'x-access-token': API_KEY, 'Content-Type': 'application/json' }
        });

        const goldData = await goldReq.json();
        const silverData = await silverReq.json();

        // Verileri birleştirip frontend'e gönderiyoruz
        return response.status(200).json({
            XAU: goldData.price, // Altın Fiyatı
            XAG: silverData.price // Gümüş Fiyatı
        });

    } catch (error) {
        return response.status(500).json({ error: 'Altın verisi çekilemedi', details: error.message });
    }
}

