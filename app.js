// --- VERSİYON (ZORUNLU GÜNCELLEME) ---
const APP_VERSION = '2.9'; 

// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Altın fiyatları rekor tazeledi.", "Merkez Bankası faiz kararını açıkladı.", "Teknoloji hisselerinde ralli var."],
    en: ["Bitcoin approaching 100K target.", "Gold prices hit new record.", "Central Bank announces rate decision.", "Tech stocks rallying today."],
    pl: ["Bitcoin zbliża się do poziomu 100 tys.", "Ceny złota biją nowe rekordy.", "Bank Centralny ogłasza decyzję ws. stóp.", "Akcje technologiczne rosną."],
    ka: ["ბიტკოინი 100 ათასს უახლოვდება.", "ოქროს ფასმა რეკორდი მოხსნა.", "ცენტრალურმა ბანკმა განაკვეთი გამოაცხადა.", "ტექნოლოგიური აქციები იზრდება."],
    ru: ["Биткойн приближается к 100К.", "Цены на золото побили рекорд.", "Центробанк объявил ставку.", "Технологические акции растут."]
};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};

// --- DİL AYARLARI (GÜNCEL) ---
const I18N = {
    tr: { amount: "MİKTAR", source: "KAYNAK", target: "HEDEF", result: "SONUÇ", reset: "SIFIRLA", enter_amount: "Miktar Girin...", analyzing: "Analiz ediliyor...", close: "Kapat", live_rate: "CANLI KUR" },
    en: { amount: "AMOUNT", source: "SOURCE", target: "TARGET", result: "RESULT", reset: "RESET", enter_amount: "Enter Amount...", analyzing: "Analyzing...", close: "Close", live_rate: "LIVE RATE" },
    pl: { amount: "ILOŚĆ", source: "ŹRÓDŁO", target: "CEL", result: "WYNIK", reset: "RESETUJ", enter_amount: "Wpisz kwotę...", analyzing: "Analizowanie...", close: "Zamknij", live_rate: "KURS NA ŻYWO" },
    ru: { amount: "СУММА", source: "ИСТОЧНИК", target: "ЦЕЛЬ", result: "РЕЗУЛЬТАТ", reset: "СБРОС", enter_amount: "Введите сумму...", analyzing: "Анализ...", close: "Закрыть", live_rate: "ЖИВОЙ КУРС" },
    ka: { amount: "თანხა", source: "წყარო", target: "მიზანი", result: "შედეგი", reset: "განულება", enter_amount: "შეიყვანეთ თანხა...", analyzing: "ანალიზი...", close: "დახურვა", live_rate: "ცოცხალი კურსი" }
};

// --- STATE ---
let state = {
    rates: {}, baseCurrency: 'USD', chartPair: 'USD', isChartSwapped: false, vsPair: null,
    lang: 'en', theme: localStorage.getItem('theme') || '#4f46e5',
    favs: JSON.parse(localStorage.getItem('favs_v9')) || ['XAU', 'XAG', 'USD', 'EUR', 'GBP'],
    cryptoFavs: JSON.parse(localStorage.getItem('crypto_v8')) || ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    drawerMode: '', neonEnabled: localStorage.getItem('neonEnabled') !== 'false', tempAsset: null, convFrom: 'USD', convTo: 'PLN',
    cryptoChartPair: 'BTC'
};
let charts = {}; let intervals = {};

// --- BAŞLANGIÇ ---
window.onload = async () => {
    if (localStorage.getItem('app_version') !== APP_VERSION) {
        localStorage.clear();
        localStorage.setItem('app_version', APP_VERSION);
        location.reload(); return;
    }

    lucide.createIcons();

    // 1. DİL AYARI
    if (!localStorage.getItem('lang')) {
        const phoneLang = navigator.language.slice(0, 2); 
        const supported = ['tr', 'en', 'pl', 'ru', 'ka'];
        state.lang = supported.includes(phoneLang) ? phoneLang : 'en';
        localStorage.setItem('lang', state.lang);
    } else {
        state.lang = localStorage.getItem('lang');
    }
    
    // 2. VERİLERİ VE KONUMU ÇEK (Önce bunu yapmalıyız ki büyük kart dolsun)
    await fetchData(); 
    await detectLocationCurrency(); 

    // 3. UI BAŞLAT
    setLanguage(state.lang);
    setTheme(state.theme);
    
    // TEMİZLİK VE DÜZELTMELER
    cleanUpUI(); // Butonları sil
    fixConverterInput(); // 0'ı sil
    renderFeaturedCard(); // BÜYÜK KARTI DOLDUR
    
    updateUI(); 
    startNewsTicker();
    
    // TradingView (Sadece detaylar için)
    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);
    
    // Reset Butonu Dinleyicisi
    const resetBtn = document.querySelector('#page-converter button.bg-slate-100');
    if(resetBtn) {
        resetBtn.id = 'reset-btn-real';
        resetBtn.onclick = fixConverterInput;
    }
};

// --- KRİTİK: ANA SAYFA BÜYÜK KART (FEATURED CARD) ---
function renderFeaturedCard() {
    // Grafik konteynerini bul
    let container = document.getElementById('chart-container') || document.querySelector('.h-64.bg-white');
    
    // Eğer bulamazsa, "USD/PLN" yazan o büyük beyaz alanı bulmaya çalış
    if(!container) {
        const allDivs = document.querySelectorAll('div');
        for(let div of allDivs) {
            // İçinde "Analiza AI" butonu olan div'i buluyoruz
            if(div.innerHTML.includes('Analiza AI') || div.innerHTML.includes('Al Analiz')) {
                container = div;
                break;
            }
        }
    }

    if(container) {
        // İçini tamamen boşalt (Bozuk grafik ve buton gitsin)
        container.innerHTML = '';
        
        // Yeni tasarımı bas
        const localCurr = state.baseCurrency; // PLN (Konumdan geldi)
        const targetCurr = 'USD'; 
        const displayPair = localCurr === 'USD' ? 'EUR' : 'USD';
        const rate = state.rates[localCurr] / state.rates[displayPair];
        
        container.className = "bg-white dark:bg-cardDark rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-center items-center h-64 border border-slate-100 dark:border-white/5";
        container.innerHTML = `
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div class="text-center z-10">
                <p class="text-sm font-bold text-slate-400 tracking-widest mb-1">${I18N[state.lang].live_rate}</p>
                <h2 class="text-6xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">
                    ${rate.toFixed(2)} <span class="text-2xl font-bold text-indigo-500">${localCurr}</span>
                </h2>
                <p class="text-lg font-medium text-slate-500">1 ${displayPair} = ${rate.toFixed(4)} ${localCurr}</p>
            </div>
            <div class="absolute bottom-0 left-0 w-full opacity-10">
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="#6366f1" fill-opacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
            </div>
        `;
    }
}

// --- DÜZELTME: ÇEVİRİCİ SIFIRLAMA (0'ı Yasakla) ---
function fixConverterInput() {
    const input = document.getElementById('conv-amount');
    if (input) {
        input.value = ''; // 0 yok, boşluk var
        input.placeholder = I18N[state.lang]?.enter_amount || "Enter Amount...";
        document.getElementById('conv-result').innerText = '---';
    }
}

// --- DÜZELTME: DİL ETİKETLERİ (MİKTAR, HEDEF vs.) ---
function updatePageLabels() {
    // HTML'deki statik yazıları bulup değiştiriyoruz
    // Bu, HTML yapısını bilmediğimiz için "tahmini" bulma yöntemidir
    const elements = document.body.getElementsByTagName("*");
    
    const labelMap = {
        'MİKTAR': 'amount', 'AMOUNT': 'amount', 'ILOŚĆ': 'amount', 'СУММА': 'amount', 'თანხა': 'amount',
        'KAYNAK': 'source', 'SOURCE': 'source', 'ŹRÓDŁO': 'source', 'ИСТОЧНИК': 'source', 'წყარო': 'source',
        'HEDEF': 'target', 'TARGET': 'target', 'CEL': 'target', 'ЦЕЛЬ': 'target', 'მიზანი': 'target',
        'SONUÇ': 'result', 'RESULT': 'result', 'WYNIK': 'result', 'РЕЗУЛЬТАТ': 'result', 'შედეგი': 'result',
        'SIFIRLA': 'reset', 'RESET': 'reset', 'RESETUJ': 'reset', 'СБРОС': 'reset', 'განულება': 'reset',
        '0': '' // Tek başına 0 yazan yerleri (başlık altı) temizle
    };

    for (let el of elements) {
        // Sadece kısa metin içeren etiketlere bak
        if (el.children.length === 0 && el.innerText && labelMap[el.innerText]) {
            const key = labelMap[el.innerText];
            el.innerText = I18N[state.lang][key];
        }
        // Sıfırla butonu özel kontrolü
        if(el.tagName === 'BUTTON' && (el.innerText === 'SIFIRLA' || el.innerText === 'RESET')) {
             el.innerText = I18N[state.lang].reset;
        }
    }
}

// --- TEMİZLİK (Hayalet Buton Avcısı) ---
function cleanUpUI() {
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        // İçinde 'Analiz' geçen ve onclick özelliği olmayan butonları sil
        if ((btn.innerText.includes('Analiz') || btn.innerText.includes('AI')) && !btn.getAttribute('onclick')) {
            btn.style.display = 'none';
        }
    });
    updateLangIcon();
}

function updateLangIcon() {
    const langBtn = document.getElementById('lang-dropdown')?.previousElementSibling; 
    if(langBtn) {
        langBtn.innerHTML = `<i data-lucide="globe" class="inline-block mr-1"></i> ${state.lang.toUpperCase()}`;
        langBtn.className = "flex items-center text-yellow-400 font-bold animate-pulse cursor-pointer";
        lucide.createIcons();
    }
}

// --- DİĞER STANDART FONKSİYONLAR ---
async function detectLocationCurrency() {
    if (localStorage.getItem('user_currency_set')) { state.baseCurrency = localStorage.getItem('baseCurr'); return; }
    try {
        const geoRes = await fetch('https://ipapi.co/json/'); const geoData = await geoRes.json(); const userCurrency = geoData.currency; 
        if (userCurrency && (state.rates[userCurrency] || userCurrency === 'PLN')) {
            state.baseCurrency = userCurrency; localStorage.setItem('baseCurr', userCurrency);
            if (!state.favs.includes(userCurrency)) { state.favs.push(userCurrency); localStorage.setItem('favs_v9', JSON.stringify(state.favs)); }
            localStorage.setItem('user_currency_set', 'true');
        }
    } catch (err) { console.log("Konum alınamadı."); }
}

async function fetchData() { 
    try { 
        const res = await fetch('/api/forex'); const data = await res.json(); 
        if(data.results) state.rates = data.results; else state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0};
        try { const goldRes = await fetch('/api/gold'); const goldData = await goldRes.json(); if(goldData.XAU) { state.rates['XAU'] = 1 / goldData.XAU; state.rates['XAG'] = 1 / goldData.XAG; } } catch (e) { state.rates['XAU'] = 1/2650; state.rates['XAG'] = 1/31; }
    } catch(e) { state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0}; } 
}

function openChartModal(symbol) {
    let modal = document.getElementById('tv-modal'); if(modal) modal.remove();
    modal = document.createElement('div'); modal.id = 'tv-modal'; modal.className = 'fixed inset-0 z-[50] bg-black flex flex-col';
    modal.innerHTML = `
        <div class="flex justify-between items-center p-4 border-b border-gray-800 bg-[#131722] relative z-[60]">
            <h3 id="tv-title" class="text-white font-bold text-lg">${symbol} / USD</h3>
            <button onclick="document.getElementById('tv-modal').remove()" class="text-gray-400 hover:text-white p-2 cursor-pointer"><i data-lucide="x" size="24"></i></button>
        </div>
        <div id="tv-chart-container" class="flex-1 w-full h-full bg-black relative z-0 pb-20"></div>
        <div class="fixed bottom-0 left-0 w-full p-4 bg-[#131722]/95 border-t border-gray-800 z-[100] flex justify-center backdrop-blur-md">
             <button onclick="openProAIChat('${symbol}')" class="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer">
                <i data-lucide="sparkles"></i> Grafer Pro Ai
             </button>
        </div>`;
    document.body.appendChild(modal); lucide.createIcons();
    let tvSymbol = symbol === 'USD' ? "FX:EURUSD" : (symbol === 'XAU' ? "OANDA:XAUUSD" : (symbol === 'BTC' ? "BINANCE:BTCUSDT" : `FX:USD${symbol}`));
    if(window.TradingView) new TradingView.widget({ "autosize": true, "symbol": tvSymbol, "interval": "D", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "container_id": "tv-chart-container" });
}

function openProAIChat(symbol) {
    const price = getPrice(symbol).toFixed(4); let chatModal = document.getElementById('pro-chat-modal'); if(chatModal) chatModal.remove();
    chatModal = document.createElement('div'); chatModal.id = 'pro-chat-modal'; chatModal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4';
    chatModal.innerHTML = `
        <div class="bg-white dark:bg-[#1e222d] w-full max-w-md h-[550px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative animate-fade-in-up">
            <div class="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
                <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><i data-lucide="bot" size="24"></i></div><div><h3 class="font-bold text-base">Grafer Pro Ai</h3><p class="text-[10px] opacity-80 uppercase tracking-wide">Online • Global</p></div></div>
                <button onclick="document.getElementById('pro-chat-modal').remove()" class="hover:text-gray-200 cursor-pointer p-2"><i data-lucide="x" size="24"></i></button>
            </div>
            <div id="pro-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-black/20 text-sm"></div>
            <div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e222d] flex gap-2 shrink-0"><input type="text" id="pro-chat-input" placeholder="..." class="flex-1 bg-slate-100 dark:bg-black/10 border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" onkeypress="handleProEnter(event)"><button onclick="sendProMessage()" class="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition cursor-pointer"><i data-lucide="send" size="20"></i></button></div>
        </div>`;
    document.body.appendChild(chatModal); lucide.createIcons();
    addProMessage(`Grafer Pro AI: Ready! Analyzing ${symbol}...`, 'bot', true); askOpenAI(`${symbol} (Price: ${price}) technical analysis.`, true);
}
function handleProEnter(e) { if(e.key === 'Enter') sendProMessage(); }
function sendProMessage() { const input = document.getElementById('pro-chat-input'); const msg = input.value.trim(); if(!msg) return; addProMessage(msg, 'user'); input.value = ''; askOpenAI(msg, false); }
async function askOpenAI(message, isInitial) {
    const container = document.getElementById('pro-chat-messages'); let loadingId = null; if(!isInitial) loadingId = addProMessage("...", 'bot', true);
    try { const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message }) }); const data = await res.json(); if(loadingId) document.getElementById(loadingId).remove(); if(isInitial) container.innerHTML = ''; if(data.reply) addProMessage(data.reply, 'bot'); else addProMessage("Error.", 'bot'); } catch (e) { if(loadingId) document.getElementById(loadingId).remove(); addProMessage("Connection Error.", 'bot'); }
}
function addProMessage(text, sender, isLoading = false) { const container = document.getElementById('pro-chat-messages'); const div = document.createElement('div'); div.className = sender === 'user' ? 'ml-auto bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm' : `bg-white dark:bg-cardDark text-slate-800 dark:text-white p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm border border-gray-100 dark:border-gray-700 ${isLoading ? 'animate-pulse text-indigo-500' : ''}`; div.innerText = text; container.appendChild(div); container.scrollTop = container.scrollHeight; return div.id = 'msg-' + Math.random(); }

function toggleLangMenu() { document.getElementById('lang-dropdown').classList.toggle('hidden'); document.getElementById('lang-dropdown').classList.toggle('flex'); }
function setLanguage(lang) {
    state.lang = lang; localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(I18N[lang][key]) el.innerText = I18N[lang][key]; });
    document.getElementById('lang-dropdown').classList.add('hidden'); document.getElementById('lang-dropdown').classList.remove('flex');
    fixConverterInput(); 
    startNewsTicker(); 
    updateLangIcon();
    renderFeaturedCard(); // Kartı güncelle
    updatePageLabels(); // Diğer etiketleri zorla güncelle
}
function startNewsTicker() { const container = document.getElementById('news-ticker'); const msgs = NEWS_DATA[state.lang] || NEWS_DATA['en']; container.innerHTML = msgs.map(m => { const query = encodeURIComponent(m); return `<a href="https://www.google.com/search?q=${query}&tbm=nws" target="_blank" class="ticker-item cursor-pointer hover:text-indigo-400 transition" style="text-decoration:none;"><span style="color:var(--theme-color)">●</span> ${m}</a>`; }).join(''); }
function getSymbol(curr) { const symbols = {'PLN':'zł', 'USD':'$', 'EUR':'€', 'TRY':'₺', 'GBP':'£', 'GEL':'₾'}; return symbols[curr] || curr; }
function setTheme(color) { state.theme = color; localStorage.setItem('theme', color); document.documentElement.style.setProperty('--theme-color', color); document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active')); initChart('mainChart', state.theme); }
function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); updatePageLabels(); }
function getFlagUrl(code) { return FLAG_MAP[code] ? `https://flagcdn.com/w80/${FLAG_MAP[code]}.png` : null; }
function getPrice(code) { let rateCode = state.rates[code]; if(!rateCode) { if(code==='BTC') rateCode=1/65000; else rateCode=1; } return (1/rateCode)*state.rates[state.baseCurrency]; }
function convert() { const inputVal = document.getElementById('conv-amount').value; if(!inputVal) { document.getElementById('conv-result').innerText = '---'; return; } const amt = parseFloat(inputVal); const rate = state.rates[state.convTo] / state.rates[state.convFrom]; const res = amt * rate; document.getElementById('conv-result').innerText = `${res.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})} ${state.convTo}`; }
function updateConverterUI() { document.getElementById('code-from').innerText = state.convFrom; document.getElementById('code-to').innerText = state.convTo; const f1 = document.getElementById('flag-from'); const f2 = document.getElementById('flag-to'); const u1 = getFlagUrl(state.convFrom); const u2 = getFlagUrl(state.convTo); if(u1) { f1.src = u1; f1.style.display='block'; } else f1.style.display='none'; if(u2) { f2.src = u2; f2.style.display='block'; } else f2.style.display='none'; }
function swapCurrencies() { [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; updateConverterUI(); convert(); }
function updateBaseCurrencyUI() { document.querySelectorAll('.base-curr-text').forEach(el => el.innerText = state.baseCurrency); document.querySelectorAll('.base-curr-symbol').forEach(el => el.innerText = getSymbol(state.baseCurrency)); document.getElementById('settings-code').innerText = state.baseCurrency; const flagUrl = getFlagUrl(state.baseCurrency); const imgEl = document.getElementById('settings-flag'); if (flagUrl) { imgEl.src = flagUrl; imgEl.style.display = 'block'; } else { imgEl.style.display = 'none'; } }
function renderGrid() { const container = document.getElementById('dashboard-grid'); const sym = getSymbol(state.baseCurrency); if(state.rates['XAU'] && !state.favs.includes('XAU')) { state.favs.push('XAU'); } container.innerHTML = state.favs.map(curr => { const val = getPrice(curr); const flagUrl = getFlagUrl(curr); let imgTag = flagUrl ? `<img src="${flagUrl}" class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 shadow-md">` : `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] border border-slate-200">${curr.substring(0,2)}</div>`; if (curr === 'XAU') imgTag = `<div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 border border-yellow-200"><i data-lucide="coins" size="16"></i></div>`; return `<div onclick="openChartModal('${curr}')" class="relative cursor-pointer bg-white dark:bg-cardDark p-4 rounded-2xl neon-box card-pop flex flex-col gap-2 shadow-sm active:scale-95 transition group"><div class="absolute top-3 right-3 text-indigo-500 dark:text-indigo-400"><i data-lucide="maximize-2" size="16"></i></div><div class="flex justify-between items-start">${imgTag}<span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">+0.4%</span></div><div><p class="font-bold text-slate-500 text-xs">${curr}/${state.baseCurrency}</p><p class="font-bold text-xl text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:3})}</p></div></div>`; }).join(''); lucide.createIcons(); }
function renderCryptoGrid() { const container = document.getElementById('crypto-grid'); const sym = getSymbol(state.baseCurrency); container.innerHTML = state.cryptoFavs.map(c => { const val = getPrice(c); const icon = CRYPTO_ICONS[c] || 'btc'; return `<div onclick="openChartModal('${c}')" class="cursor-pointer bg-white dark:bg-cardDark p-5 rounded-[1.5rem] neon-box card-pop flex items-center justify-between gap-2 shadow-sm active:scale-95 transition"><div class="flex items-center gap-3 flex-1 min-w-0"><img src="https://assets.coincap.io/assets/icons/${icon}@2x.png" class="w-10 h-10 rounded-full shadow-lg flex-shrink-0 bg-white object-cover" onerror="this.src='https://assets.coincap.io/assets/icons/btc@2x.png'"><div class="min-w-0"><span class="font-bold text-lg text-slate-800 dark:text-white block truncate">${c}</span><span class="text-xs text-slate-400 block truncate">Coin</span></div></div><div class="text-right flex-shrink-0"><p class="font-bold text-base text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><p class="text-[10px] text-green-500 font-medium">+1.2%</p></div></div>`; }).join(''); }
function nav(page) { document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active')); document.getElementById('page-' + page).classList.add('active'); document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('text-[var(--theme-color)]', 'active'); b.classList.add('text-slate-400'); b.style.color = ''; }); const btn = document.getElementById('nav-' + page); if(btn) { btn.classList.add('text-[var(--theme-color)]', 'active'); btn.classList.remove('text-slate-400'); btn.style.color = state.theme; } if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const sb = document.getElementById('sidebar'); const isOpen = sb.style.transform === 'translateX(0px)'; sb.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)'; document.getElementById('overlay').classList.toggle('hidden', isOpen); }
