// --- GRAFER TRANSLATE MODULE (v2.0 - Vision) ---

// 1. Çeviri Fonksiyonu (DeepL)
async function doTranslate() {
    const text = document.getElementById('trans-input').value;
    const target = document.getElementById('trans-target').value;
    const resultBox = document.getElementById('trans-result-box');
    const outputText = document.getElementById('trans-output');

    if (!text.trim()) {
        alert("Lütfen çevrilecek bir metin girin.");
        return;
    }

    // Yükleniyor efekti
    resultBox.classList.remove('hidden');
    outputText.innerText = "Yapay zeka düşünüyor...";
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
            outputText.innerText = "Hata: " + (data.error || "Çeviri servisine ulaşılamadı.");
        }
    } catch (e) {
        outputText.innerText = "Bağlantı hatası. İnternetinizi kontrol edin.";
        outputText.classList.remove('animate-pulse');
    }
}

// 2. Kamera & Galeri Tetikleyici
function triggerCamera() {
    document.getElementById('img-upload').click();
}

// 3. OCR (Resimden Yazıya) - Tesseract.js
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Yükleniyor ekranını aç
    const loadingOverlay = document.getElementById('ocr-loading');
    loadingOverlay.classList.remove('hidden');

    Tesseract.recognize(
        file,
        'eng+tur', // Hem İngilizce hem Türkçe karakterleri tanısın
        { 
            logger: m => console.log(m) // Konsola ilerleme durumunu yazar
        }
    ).then(({ data: { text } }) => {
        // Sonuç başarılı
        loadingOverlay.classList.add('hidden');
        if(text.trim().length > 0) {
            document.getElementById('trans-input').value = text;
        } else {
            alert("Resimde okunabilir bir yazı bulunamadı.");
        }
    }).catch(err => {
        loadingOverlay.classList.add('hidden');
        alert("Resim okunamadı. Lütfen daha net bir fotoğraf deneyin.");
        console.error(err);
    });
}

// 4. Sesli Okuma (TTS)
function speakText() {
    const text = document.getElementById('trans-output').innerText;
    const lang = document.getElementById('trans-target').value;
    
    if(!text || text === "..." || text.includes("Hata")) return;

    // Eğer önceki okuma devam ediyorsa durdur
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = {'TR':'tr-TR', 'EN':'en-US', 'DE':'de-DE', 'FR':'fr-FR', 'RU':'ru-RU', 'ES':'es-ES', 'PL':'pl-PL'};
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9; // Biraz daha doğal hız

    window.speechSynthesis.speak(utterance);
}

// 5. Mikrofon (STT)
function toggleSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Tarayıcınız bu özelliği desteklemiyor (Chrome veya Safari kullanın).");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR'; // Varsayılan dinleme dili
    recognition.start();

    const micBtn = document.getElementById('mic-btn');
    const originalIcon = micBtn.innerHTML;
    
    // Kayıt başladığında görsel değişim
    micBtn.innerHTML = '<div class="w-5 h-5 rounded-full bg-red-500 animate-ping"></div>';
    micBtn.classList.add('bg-red-100');

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const inputEl = document.getElementById('trans-input');
        // Var olan metnin sonuna ekle
        inputEl.value = inputEl.value ? inputEl.value + " " + transcript : transcript;
        resetMic();
    };

    recognition.onerror = function() { resetMic(); };
    recognition.onend = function() { resetMic(); };

    function resetMic() {
        micBtn.innerHTML = originalIcon;
        micBtn.classList.remove('bg-red-100');
        if(window.lucide) lucide.createIcons();
    }
}

// 6. Kopyalama Yardımcısı
function copyToClipboard() {
    const text = document.getElementById('trans-output').innerText;
    navigator.clipboard.writeText(text).then(() => {
        // Ufak bir bildirim (Toast) yapılabilir ama şimdilik butonu titretiyoruz
        const btn = document.querySelector('#trans-result-box button');
        const oldText = btn.innerHTML;
        btn.innerText = "Kopyalandı!";
        setTimeout(() => { 
            btn.innerHTML = oldText; 
            if(window.lucide) lucide.createIcons();
        }, 2000);
    });
}
