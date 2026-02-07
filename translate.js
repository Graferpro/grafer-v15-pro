// --- GRAFER TRANSLATE PRO (Google Free + AI + Files) ---

const LANGUAGES = { "TR": "Türkçe", "EN": "English", "DE": "Deutsch", "FR": "Français", "ES": "Español", "IT": "Italiano", "RU": "Russian", "JA": "Japanese", "KO": "Korean", "ZH": "Chinese", "AR": "Arabic", "AZ": "Azerbaijani", "BG": "Bulgarian", "CS": "Czech", "DA": "Danish", "EL": "Greek", "FA": "Persian", "FI": "Finnish", "HE": "Hebrew", "HI": "Hindi", "HU": "Hungarian", "ID": "Indonesian", "KK": "Kazakh", "NL": "Dutch", "NO": "Norwegian", "PL": "Polish", "PT": "Portuguese", "RO": "Romanian", "SK": "Slovak", "SV": "Swedish", "TH": "Thai", "UK": "Ukrainian", "UZ": "Uzbek", "VI": "Vietnamese" };

window.addEventListener('DOMContentLoaded', () => { populateLanguages(); });

function populateLanguages() {
    const sourceSel = document.getElementById('lang-source');
    const targetSel = document.getElementById('lang-target');
    if(!sourceSel || !targetSel) return;
    sourceSel.innerHTML = '<option value="auto">Otomatik (Auto)</option>';
    targetSel.innerHTML = '';
    for (const [code, name] of Object.entries(LANGUAGES)) {
        const optionS = `<option value="${code.toLowerCase()}">${name}</option>`;
        const optionT = `<option value="${code.toLowerCase()}">${name}</option>`;
        sourceSel.innerHTML += optionS;
        targetSel.innerHTML += optionT;
    }
    targetSel.value = 'en';
}

function swapLanguages() {
    const source = document.getElementById('lang-source');
    const target = document.getElementById('lang-target');
    if(source.value === 'auto') return;
    const temp = source.value; source.value = target.value; target.value = temp;
    const output = document.getElementById('trans-output').innerText;
    if(output && output !== "...") document.getElementById('trans-input').value = output;
}

async function doTranslate(mode) {
    const text = document.getElementById('trans-input').value;
    const target = document.getElementById('lang-target').value;
    const resultBox = document.getElementById('trans-result-box');
    const outputText = document.getElementById('trans-output');

    if (!text.trim()) { alert("Lütfen metin girin."); return; }

    resultBox.classList.remove('hidden');
    outputText.innerHTML = `<span class="animate-pulse text-indigo-500">Çevriliyor...</span>`;

    if (mode === 'ai') {
        const prompt = `Translate this to ${LANGUAGES[target.toUpperCase()] || target} (Professional & Natural): "${text}"`;
        try {
            const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: prompt }) });
            const data = await res.json();
            if(data.reply) outputText.innerText = data.reply; else outputText.innerText = "AI Hatası.";
        } catch(e) { outputText.innerText = "AI Bağlantı Hatası."; }
        return;
    }

    try {
        const res = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: text, target_lang: target }) });
        const data = await res.json();
        if (data.translatedText) outputText.innerText = data.translatedText; else outputText.innerText = "Hata: " + (data.error || "Sunucu hatası.");
    } catch (e) { outputText.innerText = "Bağlantı hatası."; }
}

function triggerCamera() { document.getElementById('img-upload').click(); }

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const overlay = document.getElementById('ocr-loading');
    const loadingText = overlay.querySelector('p');
    overlay.classList.remove('hidden');
    
    let extractedText = "";
    try {
        if (file.type.startsWith('image/')) {
            loadingText.innerText = "Resim Okunuyor...";
            const { data: { text } } = await Tesseract.recognize(file, 'eng+tur', { logger: m => console.log(m) });
            extractedText = text;
        } else if (file.name.endsWith('.docx')) {
            loadingText.innerText = "Word Dosyası...";
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            extractedText = result.value;
        } else if (file.type === 'application/pdf') {
            loadingText.innerText = "PDF Taranıyor...";
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                extractedText += textContent.items.map(item => item.str).join(' ') + "\n\n";
            }
        }
        
        if(extractedText) {
            document.getElementById('trans-input').value = extractedText;
            await doTranslate('google'); // OTOMATİK ÇEVİRİ
        }
    } catch (err) { alert("Dosya okunamadı."); } finally { overlay.classList.add('hidden'); }
}

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
    recognition.lang = 'tr-TR'; recognition.start();
    document.getElementById('mic-btn').classList.add('bg-red-500', 'text-white', 'animate-pulse');
    recognition.onresult = (event) => {
        document.getElementById('trans-input').value = event.results[0][0].transcript;
        document.getElementById('mic-btn').classList.remove('bg-red-500', 'text-white', 'animate-pulse');
    };
}

function copyToClipboard() {
    navigator.clipboard.writeText(document.getElementById('trans-output').innerText);
    const btn = document.querySelector('#trans-result-box button:last-child');
    const oldHtml = btn.innerHTML; btn.innerHTML = '<i data-lucide="check"></i>';
    setTimeout(() => { btn.innerHTML = oldHtml; lucide.createIcons(); }, 1500);
}
