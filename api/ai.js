// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'Key Yok' });

    const { message } = req.body; // Artık kullanıcı ne yazarsa onu alıyoruz

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Hızlı ve akıllı
                messages: [
                    { 
                        "role": "system", 
                        // İŞTE EĞİTİM BURADA: Asla İngilizce konuşma emri.
                        "content": "Senin adın 'Grafer AI'. Sen profesyonel, yardımsever ve esprili bir finans asistanısın. YALNIZCA TÜRKÇE konuşmalısın. Kullanıcı İngilizce sorsa bile sen Türkçe cevap ver. Cevapların kısa, net ve yatırım tavsiyesi içermeyen (YTD) şekilde olsun." 
                    },
                    { 
                        "role": "user", 
                        "content": message // Kullanıcının sorusu
                    }
                ],
                max_tokens: 200
            })
        });

        const data = await response.json();
        if(data.choices) return res.status(200).json({ reply: data.choices[0].message.content });
        else return res.status(500).json({ error: 'Cevap yok' });

    } catch (e) { return res.status(500).json({ error: e.message }); }
}
