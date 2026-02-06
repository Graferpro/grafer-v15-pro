// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'Key Yok' });

    const { message, lang } = req.body;
    
    // 1. Sistemin ana dilini belirle (Açılış için)
    const baseLang = (lang === 'tr') ? 'Turkish' : 'English';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        "role": "system", 
                        // DİL EMRİ GÜNCELLENDİ: Esnek ve Akıllı.
                        "content": `Sen 'Grafer AI' adında finansal bir asistansın. 
                        Varsayılan dilin: ${baseLang}. İlk cevabı bu dilde ver.
                        ANCAK: Eğer kullanıcı farklı bir dilde (örneğin Lehçe, Rusça, Almanca) soru sorarsa, DERHAL o dile geç ve o dilde cevap ver.
                        Cevapların kısa, profesyonel ve yatırım tavsiyesi içermeyen (YTD) şekilde olsun.` 
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
