// --- GRAFER TRANSLATE PRO (Google Free + AI + Files) ---

// 100+ DİL LİSTESİ (Google Destekli)
const LANGUAGES = {
    "TR": "Türkçe", "EN": "English", "DE": "Deutsch", "FR": "Français", "ES": "Español", "IT": "Italiano", "RU": "Russian", "JA": "Japanese", "KO": "Korean", "ZH": "Chinese", "AR": "Arabic", "AZ": "Azerbaijani", "BG": "Bulgarian", "CS": "Czech", "DA": "Danish", "EL": "Greek", "FA": "Persian", "FI": "Finnish", "HE": "Hebrew", "HI": "Hindi", "HU": "Hungarian", "ID": "Indonesian", "KK": "Kazakh", "NL": "Dutch", "NO": "Norwegian", "PL": "Polish", "PT": "Portuguese", "RO": "Romanian", "SK": "Slovak", "SV": "Swedish", "TH": "Thai", "UK": "Ukrainian", "UZ": "Uzbek", "VI": "Vietnamese"
};

// Sayfa Yüklendiğinde Dilleri Doldur
window.addEventListener('DOMContentLoaded', () => {
    populateLanguages();
});

function populateLanguages() {
    const sourceSel = document.getElementById('lang-source');
    const targetSel = document.getElementById('lang-target');
    
    // Eğer elementler henüz yoksa (sayfa geçişi) dur.
    if(!sourceSel || !targetSel) return;

    // Önce temizle (Auto kalsın)
    sourceSel.innerHTML = '<option value="auto">Otomatik (Auto)</option>';
    targetSel.innerHTML = '';

    for (const [code, name] of Object.entries(LANGUAGES)) {
        const optionS = `<option value="${code.toLowerCase()}">${name}</option>`;
        const optionT = `<option value="${code.toLowerCase()}">${name}</option>`;
        sourceSel.innerHTML += optionS;
        targetSel.innerHTML += optionT;
    }
    
    // Varsayılanları ayarla
    targetSel.value = 'en'; // Hedef İngilizce başlasın
}

// 1. Dil Değiştirme
function swapLanguages() {
    const source = document.getElementById('lang-source');
    const target = document.getElementById('lang-target');
    if(source.value === 'auto') return;
    const temp = source.value; source.value = target.value; target.value = temp;
    
    const output = document.getElementById('trans-output').innerText;
    if(output && output !== "...") document.getElementById('trans-input').value = output;
}

// 2. Çeviri Motoru (Google & AI)
async function doTranslate(mode) {
    const text = document.getElementById('trans-input').value;
    const target = document.getElementById('lang-target').value;
    const resultBox = document.getElementById('trans-result-box');
    const outputText = document.getElementById('trans-output');

    if (!text.trim()) { alert("Lütfen metin girin."); return; }

    resultBox.classList.remove('hidden');
    outputText.innerHTML = `<span class="animate-pulse text-indigo-500">Çevriliyor...</span>`;

    // AI MODU (OpenAI)
    if (mode === 'ai') {
        const prompt = `Translate this to ${LANGUAGES[target.toUpperCase()] || target} (Professional & Natural): "${text}"`;
        // app.js'deki fonksiyonu kullanıyoruz ama yanıtı buraya alacağız
        try {
            const res = await fetch('/api/ai', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt })
            });
            const data = await res.json();
            if(data.reply) outputText.innerText = data.reply;
            else outputText.innerText = "AI Hatası.";
        } catch(e) { outputText.innerText = "AI Bağlantı Hatası."; }
        return;
    }

    // GOOGLE FREE MODU
    try {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, target_lang: target })
        });
        const data = await res.json();
        
        if (data.translatedText) {
            outputText.innerText = data.translatedText;
        } else {
            outputText.innerText = "Hata: " + (data.error || "Sunucu hatası.");
        }
    } catch (e) {
        outputText.innerText = "Bağlantı hatası.";
    }
}

// 3. Dosya Yükleme (PDF, Word, Resim)
function triggerCamera() { document.getElementById('img-upload').click(); }

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const overlay = document.getElementById('ocr-loading');
    const loadingText = overlay.querySelector('p');
    overlay.classList.remove('hidden');
    
    try {
        // A) RESİM İSE (OCR)
        if (file.type.startsWith('image/')) {
            loadingText.innerText = "Resim Okunuyor...";
            const { data: { text } } = await Tesseract.recognize(file, 'eng+tur', { logger: m => console.log(m) });
            document.getElementById('trans-input').value = text;
        }
        // B) WORD İSE (.docx)
        else if (file.name.endsWith('.docx')) {
            loadingText.innerText = "Word Dosyası Açılıyor...";
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            document.getElementById('trans-input').value = result.value;
        }
        // C) PDF İSE
        else if (file.type === 'application/pdf') {
            loadingText.innerText = "PDF Taranıyor...";
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";
            
            // İlk 5 sayfayı oku (Çok uzun olmasın diye)
            const maxPages = Math.min(pdf.numPages, 5);
            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + "\n\n";
            }
            document.getElementById('trans-input').value = fullText;
            if(pdf.numPages > 5) alert("PDF çok uzun, sadece ilk 5 sayfa alındı.");
        }
        else {
            alert("Desteklenmeyen dosya formatı. (Sadece Resim, Word, PDF)");
        }
    } catch (err) {
        alert("Dosya okunamadı: " + err.message);
        console.error(err);
    } finally {
        overlay.classList.add('hidden');
    }
}

// 4. Sesli Okuma & Mikrofon
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
    recognition.lang = 'tr-TR'; 
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
