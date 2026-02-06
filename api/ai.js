// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'Key Yok' });

    const { message, lang } = req.body;
    
    // Dil kodunu tam isme çevir
    const langMap = { 'tr': 'Turkish', 'en': 'English', 'pl': 'Polish', 'ru': 'Russian' };
    const systemLang = langMap[lang] || 'English';

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
                        Varsayılan Dilin: ${systemLang}.
                        KURAL 1: Kullanıcıya öncelikle ${systemLang} dilinde cevap ver.
                        KURAL 2: Eğer kullanıcı farklı bir dilde sorarsa (Örn: Lehçe), o dile geç.
                        Kısa, net ve finansal tavsiye vermeden konuş.` 
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
        else return res.status(500).json({ error: '...' });

    } catch (e) { return res.status(500).json({ error: e.message }); }
}
