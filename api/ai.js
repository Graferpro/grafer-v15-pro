// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'Key Yok' });

    const { message } = req.body; // Artık dil kodu göndermiyoruz, AI kendi anlasın.

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        "role": "system", 
                        "content": `You are 'Grafer Pro AI'. 
                        Your Default Language is ENGLISH.
                        CRITICAL RULE: Always reply in the SAME LANGUAGE the user writes in.
                        - If user writes in Turkish -> Reply in Turkish.
                        - If user writes in Polish -> Reply in Polish.
                        - If user writes in English -> Reply in English.
                        Keep answers short, professional and strictly financial. No investment advice.` 
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
        else return res.status(500).json({ error: 'No response' });

    } catch (e) { return res.status(500).json({ error: e.message }); }
}
