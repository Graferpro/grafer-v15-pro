// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'OpenAI Key Yok' });

    const { symbol, price, lang } = req.body;
    
    // Eğer Frontend'den 'tr' geliyorsa KESİN Türkçe olacak.
    // 'state.lang' varsayılan olarak 'en' ise İngilizce olur.
    // O yüzden app.js'de dilin doğru ayarlandığından emin olmalıyız.
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
                        "content": `You are a financial expert. You MUST output your response in ${userLang} language only.` 
                    },
                    { 
                        "role": "user", 
                        "content": `Analyze ${symbol} at price ${price}. Short technical comment (2 sentences).` 
                    }
                ]
            })
        });

        const data = await response.json();
        if(data.choices) return res.status(200).json({ message: data.choices[0].message.content });
        
    } catch (e) { return res.status(500).json({ error: 'AI Error' }); }
}
