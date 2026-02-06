// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;

    if (!API_KEY) return res.status(500).json({ error: 'OpenAI Anahtarı Eksik!' });

    const { symbol, price, lang } = req.body;
    if (!symbol || !price) return res.status(400).json({ error: 'Eksik veri' });

    // Hangi dilde konuşacağını kesinleştiriyoruz
    const targetLang = lang === 'tr' ? 'Türkçe' : 'İngilizce';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Veya "gpt-3.5-turbo"
                messages: [
                    { 
                        // SİSTEM EMRİ: Dil kuralını buraya koyduk, artık kaçamaz.
                        "role": "system", 
                        "content": `Sen uzman bir finans asistanısın. Yanıtlarını KESİNLİKLE ${targetLang} dilinde ver. Asla başka dil kullanma.` 
                    },
                    { 
                        "role": "user", 
                        "content": `${symbol} şu an ${price} fiyatında. Teknik analiz göstergelerine (RSI, Trend) dayalıymış gibi duran, yatırım tavsiyesi içermeyen, 2 cümlelik kısa bir piyasa yorumu yap.` 
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if(data.choices && data.choices[0]) {
            return res.status(200).json({ message: data.choices[0].message.content });
        } else {
            throw new Error("OpenAI cevap vermedi");
        }

    } catch (error) {
        console.error("AI Hatası:", error);
        return res.status(500).json({ error: 'Analiz yapılamadı.' });
    }
}
