// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'Key Yok' });

    const { symbol, price, lang } = req.body;
    
    // Backend tarafında da son kontrol: 'tr' geldiyse TÜRKÇE, yoksa İNGİLİZCE.
    const userLang = (lang === 'tr') ? 'Turkish' : 'English';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        "role": "system", 
                        // SİSTEM EMRİ: Sadece bu dilde konuş!
                        "content": `You are a financial expert. You MUST respond in ${userLang} language ONLY. Keep it short (2 sentences).` 
                    },
                    { 
                        "role": "user", 
                        "content": `Analyze ${symbol} price: ${price}.` 
                    }
                ]
            })
        });

        const data = await response.json();
        if(data.choices) return res.status(200).json({ message: data.choices[0].message.content });
        else return res.status(500).json({ error: 'No response' });

    } catch (e) { return res.status(500).json({ error: e.message }); }
}
