// api/ai.js
export default async function handler(req, res) {
    // 1. OpenAI Anahtarını Vercel Ayarlarından Al
    const API_KEY = process.env.API_KEY_OPENAI;

    if (!API_KEY) {
        return res.status(500).json({ error: 'OpenAI Anahtarı Eksik! (Vercel Settings\'e ekle)' });
    }

    // 2. Frontend'den gelen veriyi al (Örn: Altın, Fiyat: 2650)
    const { symbol, price, lang } = req.body;

    if (!symbol || !price) {
        return res.status(400).json({ error: 'Eksik veri' });
    }

    // 3. Yapay Zekaya Gönderilecek Emir (Prompt)
    const prompt = `
    Sen uzman bir finans analistisin.
    Varlık: ${symbol}
    Şu anki Fiyat: ${price}
    
    Lütfen bu varlık için teknik göstergelere (RSI, MACD, Trend) dayalıymış gibi duran, yatırım tavsiyesi içermeyen, çok kısa ve öz (maksimum 2 cümle) bir piyasa yorumu yap.
    Yanıtı şu dilde ver: ${lang === 'tr' ? 'Türkçe' : 'İngilizce'}
    `;

    try {
        // 4. OpenAI'a İstek At (GPT-4o-mini veya GPT-3.5-turbo)
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Veya "gpt-3.5-turbo"
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100, // Kısa cevap
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // Cevabı al ve frontend'e gönder
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

