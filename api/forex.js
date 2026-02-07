export default async function handler(request, response) {
// Vercel ayarlarından anahtarı çekiyoruz
// Eğer Vercel'de ismini farklı koyduysan burayı değiştir (Örn: PROCESS.ENV.FAST_FOREX_KEY)
const API_KEY = process.env.API_KEY_FOREX;

if (!API_KEY) {  
    return response.status(500).json({ error: 'API Anahtarı (Environment Variable) bulunamadı!' });  
}  

try {  
    // Fast Forex'e istek atıyoruz  
    const url = `https://api.fastforex.io/fetch-all?api_key=${API_KEY}`;  
    const backendRes = await fetch(url);  
    const data = await backendRes.json();  

    // Veriyi senin siteye gönderiyoruz  
    return response.status(200).json(data);  

} catch (error) {  
    return response.status(500).json({ error: 'Veri çekilemedi', details: error.message });  
}

}