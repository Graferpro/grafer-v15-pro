export default async function handler(request, response) {
    const API_KEY = process.env.API_KEY_FOREX;

    if (!API_KEY) {  
        return response.status(500).json({ error: 'API Anahtarı bulunamadı!' });  
    }  

    try {  
        const url = `https://api.fastforex.io/fetch-all?api_key=${API_KEY}`;  
        const backendRes = await fetch(url);  
        const data = await backendRes.json();  

        return response.status(200).json(data);  

    } catch (error) {  
        return response.status(500).json({ error: 'Forex verisi çekilemedi', details: error.message });  
    }
}
