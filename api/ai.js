// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;

    if (!API_KEY) return res.status(500).json({ error: 'OpenAI Anahtarı Eksik!' });

    const { symbol, price, lang } = req.body;
    
    // Dil ayarını kesinleştiriyoruz
    // Eğer gelen lang 'tr' ise Türkçe, değilse İngilizce olsun
    const systemLang = lang === 'tr' ? 'Turkish' : 'English';

    if (!symbol || !price) return res.status(400).json({ error: 'Eksik veri' });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", 
                messages: [
                    { 
                        // KESİN DİL EMRİ
                        "role": "system", 
                        "content": `You are a financial analyst. You MUST respond in ${systemLang} language ONLY. Do not use any other language.` 
                    },
                    { 
                        "role": "user", 
                        "content": `Asset: ${symbol}, Price: ${price}. Give a very short (2 sentences), professional technical analysis comment (RSI, Trend) as if you are an expert.` 
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
