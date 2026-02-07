// --- GRAFER TRANSLATE PRO (v3.0) ---

// 1. Dil Değiştirme (Swap)
function swapLanguages() {
    const source = document.getElementById('lang-source');
    const target = document.getElementById('lang-target');
    
    // Auto ise değiştirme
    if(source.value === 'AUTO') return;

    const temp = source.value;
    source.value = target.value;
    target.value = temp;
    
    // Sonucu da giriş alanına taşı (Google gibi)
    const output = document.getElementById('trans-output').innerText;
    if(output && output !== "...") {
        document.getElementById('trans-input').value = output;
        document.getElementById('trans-result-box').classList.add('hidden');
    }
}

// 2. Çeviri Motoru (DeepL & AI)
async function doTranslate(mode) {
    const text = document.getElementById('trans-input').value;
    const source = document.getElementById('lang-source').value;
    const target = document.getElementById('lang-target').value;
    const resultBox = document.getElementById('trans-result-box');
    const outputText = document.getElementById('trans-output');

    if (!text.trim()) {
        alert("Lütfen metin girin.");
        return;
    }

    resultBox.classList.remove('hidden');
    outputText.innerHTML = `<span class="animate-pulse">Çevriliyor...</span>`;

    // AI MODU (OpenAI Kullanır)
    if (mode === 'ai') {
        askOpenAI(`Translate this text to ${target} language naturally and professionally: "${text}"`, false)
            .then(res => {
               // app.js'deki askOpenAI fonksiyonunu kullanıyoruz ama dönüşü buraya almamız lazım.
               // Bu yüzden basit bir fetch yapalım:
               return fetch('/api/ai', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ message: `Translate to ${target} (Professional Tone): ${text}` })
               });
            })
            .then(res => res.json())
            .then(data => {
                if(data.reply) outputText.innerText = data.reply;
                else outputText.innerText = "AI Hatası.";
            })
            .catch(() => outputText.innerText = "AI Bağlantı Hatası.");
        return;
    }

    // NORMAL MOD (DeepL)
    try {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, target_lang: target, source_lang: source === 'AUTO' ? null : source })
        });
        const data = await res.json();
        
        if (data.translatedText) {
            outputText.innerText = data.translatedText;
        } else {
            outputText.innerText = "Hata: " + (data.details || "Bilinmeyen hata.");
        }
    } catch (e) {
        outputText.innerText = "Bağlantı hatası.";
    }
}

// 3. Kamera & OCR (Gelişmiş)
function triggerCamera() { document.getElementById('img-upload').click(); }

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('ocr-loading').classList.remove('hidden');

    Tesseract.recognize(file, 'eng+tur+deu+fra', { logger: m => console.log(m) })
        .then(({ data: { text } }) => {
            document.getElementById('ocr-loading').classList.add('hidden');
            if(text.trim().length > 0) {
                document.getElementById('trans-input').value = text;
            } else {
                alert("Yazı okunamadı.");
            }
        })
        .catch(err => {
            document.getElementById('ocr-loading').classList.add('hidden');
            alert("Resim işlenemedi.");
        });
}

// 4. Sesli Okuma & Mikrofon (Aynı kalabilir, iyileştirildi)
function speakText() {
    const text = document.getElementById('trans-output').innerText;
    if(!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

function toggleSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Tarayıcı desteklemiyor."); return; }
    
    const recognition = new SpeechRecognition();
    recognition.lang = document.getElementById('lang-source').value === 'AUTO' ? 'tr-TR' : document.getElementById('lang-source').value; 
    recognition.start();
    
    document.getElementById('mic-btn').classList.add('bg-red-500', 'text-white', 'animate-pulse');

    recognition.onresult = (event) => {
        document.getElementById('trans-input').value = event.results[0][0].transcript;
        document.getElementById('mic-btn').classList.remove('bg-red-500', 'text-white', 'animate-pulse');
    };
}

function copyToClipboard() {
    navigator.clipboard.writeText(document.getElementById('trans-output').innerText);
    alert("Kopyalandı!");
}
