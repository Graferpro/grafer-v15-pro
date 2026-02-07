// --- GRAFER TRANSLATE (DeepL + Voice) ---

// 1. Çeviri Fonksiyonu
async function doTranslate() {
    const text = document.getElementById('trans-input').value;
    const target = document.getElementById('trans-target').value;
    const resultBox = document.getElementById('trans-result-box');
    const outputText = document.getElementById('trans-output');

    if (!text) return;

    // Yükleniyor efekti
    resultBox.classList.remove('hidden');
    outputText.innerText = "DeepL Çeviriyor...";
    outputText.classList.add('animate-pulse');

    try {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, target_lang: target })
        });
        const data = await res.json();

        outputText.classList.remove('animate-pulse');
        
        if (data.translatedText) {
            outputText.innerText = data.translatedText;
        } else {
            outputText.innerText = "Hata: " + (data.error || "Çevrilemedi.");
        }
    } catch (e) {
        outputText.innerText = "Bağlantı hatası.";
        outputText.classList.remove('animate-pulse');
    }
}

// 2. Sesli Okuma (Text-to-Speech)
function speakText() {
    const text = document.getElementById('trans-output').innerText;
    const lang = document.getElementById('trans-target').value;
    
    if(!text || text === "..." || text.includes("Hata")) return;

    const utterance = new SpeechSynthesisUtterance(text);
    // Dil kodlarını eşleştir
    const langMap = {'TR':'tr-TR', 'EN':'en-US', 'DE':'de-DE', 'FR':'fr-FR', 'RU':'ru-RU', 'ES':'es-ES'};
    utterance.lang = langMap[lang] || 'en-US';

    window.speechSynthesis.speak(utterance);
}

// 3. Mikrofon (Speech-to-Text)
function toggleSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tarayıcınız sesli komutu desteklemiyor. (Chrome kullanın)");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR'; // Şimdilik Türkçe dinler
    recognition.start();

    const micBtn = document.getElementById('mic-btn');
    micBtn.classList.add('text-red-500', 'animate-pulse'); // Kayıt başladı efekti

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('trans-input').value = transcript;
        micBtn.classList.remove('text-red-500', 'animate-pulse');
    };

    recognition.onerror = function(event) {
        micBtn.classList.remove('text-red-500', 'animate-pulse');
    };
    
    recognition.onend = function() {
        micBtn.classList.remove('text-red-500', 'animate-pulse');
    };
}
