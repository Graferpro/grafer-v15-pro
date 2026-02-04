
export default function handler(req, res) {
    // CORS ayarları (Frontend'in bu API'ye erişebilmesi için)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 

    // Vercel'deki gizli kasadan anahtarları alıyoruz
    // NOT: Kodda 'VITE_' ön eklerini kaldırdım çünkü Vercel ekranında öyle görünüyor.
    res.status(200).json({
        API_KEY_FOREX: process.env.API_KEY_FOREX,
        API_KEY_GOLD: process.env.API_KEY_GOLD,
        API_KEY_FINNHUB: process.env.API_KEY_FINNHUB,
        // Eğer hava durumu anahtarın varsa onu da ekleyebilirsin:
        // API_KEY_WEATHER: process.env.API_KEY_WEATHER 
    });
}
