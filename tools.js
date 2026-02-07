// --- GRAFER TRANSLATE MODÜLÜ ---

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
    }
}

// --- SESLİ OKUMA (TTS) ---
function speakText() {
    const text = document.getElementById('trans-output').innerText;
    const lang = document.getElementById('trans-target').value; // Seçili dil (TR, EN vs.)
    
    if(!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    // Dil kodunu ayarla (DeepL 'EN' dönüyor ama tarayıcı 'en-US' ister, basit eşleşme)
    if(lang === 'TR') utterance.lang = 'tr-TR';
    else if(lang === 'EN') utterance.lang = 'en-US';
    else if(lang === 'DE') utterance.lang = 'de-DE';
    else if(lang === 'FR') utterance.lang = 'fr-FR';
    else if(lang === 'RU') utterance.lang = 'ru-RU';
    else if(lang === 'ES') utterance.lang = 'es-ES';

    window.speechSynthesis.speak(utterance);
}

// --- MİKROFON (Speech-to-Text) ---
function toggleSpeech() {
    // Tarayıcı desteği kontrolü
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tarayıcınız sesli komutu desteklemiyor. (Chrome kullanın)");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR'; // Şimdilik Türkçe dinliyor, istersen ayar ekleriz.
    recognition.start();

    const micBtn = document.getElementById('mic-btn');
    micBtn.classList.add('text-red-500', 'animate-pulse'); // Kayıt başladığını göster

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('trans-input').value = transcript;
        micBtn.classList.remove('text-red-500', 'animate-pulse');
        // Otomatik çevirsin mi? İstersen buraya doTranslate() ekle.
    };

    recognition.onerror = function(event) {
        micBtn.classList.remove('text-red-500', 'animate-pulse');
        alert("Ses anlaşılamadı.");
    };
    
    recognition.onend = function() {
        micBtn.classList.remove('text-red-500', 'animate-pulse');
    };
}
