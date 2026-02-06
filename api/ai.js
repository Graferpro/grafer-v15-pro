// api/ai.js
export default async function handler(req, res) {
    const API_KEY = process.env.API_KEY_OPENAI;
    if (!API_KEY) return res.status(500).json({ error: 'Key Yok' });

    const { message } = req.body;

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
                        You are a helpful financial assistant.
                        CRITICAL RULE: Detect the language of the user's message and reply in the SAME language.
                        - If user asks in Turkish -> Reply in Turkish.
                        - If user asks in English -> Reply in English.
                        - If user asks in Polish -> Reply in Polish.
                        Keep answers short, professional, and strictly financial. No investment advice.` 
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
