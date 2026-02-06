// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'Key Yok' });

    const { message, lang } = req.body;
    
    // Dil Haritası (Genişletilebilir)
    const langMap = {
        'tr': 'Turkish',
        'en': 'English',
        'pl': 'Polish',
        'ru': 'Russian',
        'ka': 'Georgian',
        'de': 'German',
        'fr': 'French'
    };

    // Frontend'den gelen 'tr', 'pl' kodunu tam isme çevir (Yoksa English yap)
    const targetLang = langMap[lang] || 'English';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        "role": "system", 
                        "content": `Senin adın 'Grafer Pro Ai Asistan'. 
                        Sen profesyonel bir finans uzmanısın.
                        GÖREVİN: Kullanıcıya YALNIZCA ${targetLang} dilinde cevap vermek.
                        Kullanıcı başka dilde sorsa bile sen ısrarla ${targetLang} konuş.
                        Cevapların kısa, net ve yatırım tavsiyesi içermeyen (YTD) şekilde olsun.` 
                    },
                    { 
                        "role": "user", 
                        "content": message 
                    }
                ]
            })
        });

        const data = await response.json();
        if(data.choices) return res.status(200).json({ reply: data.choices[0].message.content });
        else return res.status(500).json({ error: 'Cevap yok' });

    } catch (e) { return res.status(500).json({ error: e.message }); }
}
