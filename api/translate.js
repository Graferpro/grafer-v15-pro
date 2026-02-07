export default async function handler(request, response) {
    // NOT: Bu yöntem Google'ın public API'sini kullanır. Anahtar istemez!
    // Bedavadır ve çok hızlıdır.

    const { text, target_lang } = request.body;

    if (!text) return response.status(400).json({ error: 'Metin yok' });

    try {
        // Google Translate Free API URL'si
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target_lang}&dt=t&q=${encodeURIComponent(text)}`;

        const res = await fetch(url);
        const data = await res.json();

        // Google veriyi parça parça array olarak döner, birleştirelim
        let translatedText = "";
        if (data && data[0]) {
            data[0].forEach(part => {
                if (part[0]) translatedText += part[0];
            });
        }

        return response.status(200).json({ translatedText: translatedText });

    } catch (error) {
        return response.status(500).json({ error: 'Google Translate Hatası', details: error.message });
    }
}
