// Dosya: /api/translate.js
export default async function handler(request, response) {
    const API_KEY = process.env.API_KEY_DEEPL; // Vercel'e eklediğin anahtar

    if (!API_KEY) {
        return response.status(500).json({ error: 'DeepL API Anahtarı eksik!' });
    }

    // Frontend'den gelen veriyi al
    const { text, target_lang } = request.body;

    if (!text || !target_lang) {
        return response.status(400).json({ error: 'Metin veya dil seçilmedi.' });
    }

    try {
        // DeepL Free API'sine istek atıyoruz (Pro kullanıyorsan 'api.deepl.com' yap)
        const url = 'https://api-free.deepl.com/v2/translate';
        
        const params = new URLSearchParams();
        params.append('auth_key', API_KEY);
        params.append('text', text);
        params.append('target_lang', target_lang.toUpperCase()); // "TR", "EN" gibi

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });

        const data = await res.json();

        if (data.translations) {
            return response.status(200).json({ translatedText: data.translations[0].text });
        } else {
            throw new Error('Çeviri başarısız.');
        }

    } catch (error) {
        return response.status(500).json({ error: 'DeepL Hatası', details: error.message });
    }
}
