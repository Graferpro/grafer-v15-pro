// --- VERSİYON (GÜNCEL) ---
const APP_VERSION = '2.6'; 

// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

const I18N = {
    tr: { amount: "MİKTAR", source: "KAYNAK", target: "HEDEF", result: "SONUÇ", reset: "SIFIRLA", enter: "Miktar...", dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", crypto_assets: "Kripto Varlıklar", theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", ai_title: "Grafer Pro Ai Asistan", ai_subtitle: "Piyasa Analizi", close: "Kapat", analyzing: "Analiz ediliyor..." },
    en: { amount: "AMOUNT", source: "SOURCE", target: "TARGET", result: "RESULT", reset: "RESET", enter: "Amount...", dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", crypto_assets: "Crypto Assets", theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", ai_title: "Grafer Pro Ai Assistant", ai_subtitle: "Market Analysis", close: "Close", analyzing: "Analyzing..." },
    pl: { amount: "ILOŚĆ", source: "ŹRÓDŁO", target: "CEL", result: "WYNIK", reset: "RESETUJ", enter: "Kwota...", dark_mode: "Tryb ciemny", dashboard: "Rynek", portfolio: "Portfel", crypto: "Krypto", converter: "Przelicznik", settings: "Ustawienia", market: "Rynek", edit: "Edytuj", total_asset: "AKTYWA OGÓŁEM", add: "Dodaj", crypto_assets: "Aktywa Krypto", theme_color: "Kolor motywu", default_currency: "Domyślna Waluta", ai_analysis: "Analiza AI", ai_title: "Grafer Pro Ai Asystent", ai_subtitle: "Analiza Rynkowa", close: "Zamknij", analyzing: "Analizowanie..." }
};

const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Altın fiyatları rekor tazeledi.", "Merkez Bankası faiz kararını açıkladı.", "Teknoloji hisselerinde ralli var."],
    en: ["Bitcoin approaching 100K target.", "Gold prices hit new record.", "Central Bank announces rate decision.", "Tech stocks rallying today."],
    pl: ["Bitcoin zbliża się do poziomu 100 tys.", "Ceny złota biją nowe rekordy.", "Bank Centralny ogłasza decyzję ws. stóp.", "Akcje technologiczne rosną."]
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

window.onload = async () => {
    // 0. Cache Temizliği
    if (localStorage.getItem('app_version') !== APP_VERSION) {
        localStorage.clear();
        localStorage.setItem('app_version', APP_VERSION);
        location.reload(); return;
    }

    lucide.createIcons();

    // 1. DİL AYARI
    if (!localStorage.getItem('lang')) {
        const phoneLang = navigator.language.slice(0, 2); 
        state.lang = I18N[phoneLang] ? phoneLang : 'en'; 
        localStorage.setItem('lang', state.lang);
    } else {
        state.lang = localStorage.getItem('lang');
    }
    setLanguage(state.lang);
    updateLangIcon();
    
    // 2. TEMA VE GRAFİK
    setTheme(state.theme);
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');
    
    // 3. VERİLERİ ÇEK
    await fetchData(); 
    await detectLocationCurrency(); 

    // Neon
    const neonToggle = document.getElementById('neon-toggle'); 
    if(neonToggle) {
        neonToggle.checked = state.neonEnabled;
        if(state.neonEnabled) document.body.classList.add('neon-active');
        neonToggle.addEventListener('change', (e) => { state.neonEnabled = e.target.checked; localStorage.setItem('neonEnabled', state.neonEnabled); if(state.neonEnabled) document.body.classList.add('neon-active'); else document.body.classList.remove('neon-active'); });
    }

    if(state.baseCurrency === state.chartPair) state.chartPair = 'EUR';
    updateUI(); startLiveSimulations(); startNewsTicker();
    
    // --- [DÜZELTME 1]: O BUTONU GİZLE ---
    const aiBtn = document.querySelector('button[onclick="openAIModal()"]');
    if(aiBtn) aiBtn.style.display = 'none';

    // --- [DÜZELTME 2]: 100 YAZISINI SİL ---
    const inp = document.getElementById('conv-amount');
    if(inp) { 
        inp.value = ''; 
        inp.placeholder = I18N[state.lang].enter;
    }
    
    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) themeToggle.addEventListener('change', (e) => { document.documentElement.classList.toggle('dark', e.target.checked); });
};

// --- İKON GÜNCELLEME ---
function updateLangIcon() {
    const langBtn = document.getElementById('lang-dropdown')?.previousElementSibling; 
    if(langBtn) {
        langBtn.innerHTML = `<i data-lucide="globe" class="inline-block mr-1"></i> ${state.lang.toUpperCase()}`;
        langBtn.classList.add('text-indigo-500', 'font-bold');
        lucide.createIcons();
    }
}

// --- KONUMDAN PARA BİRİMİ BULMA ---
async function detectLocationCurrency() {
    if (localStorage.getItem('user_currency_set')) { state.baseCurrency = localStorage.getItem('baseCurr'); return; }
    try {
        const geoRes = await fetch('https://ipapi.co/json/'); const geoData = await geoRes.json();
        const userCurrency = geoData.currency; 
        if (userCurrency && (state.rates[userCurrency] || userCurrency === 'PLN' || userCurrency === 'TRY')) {
            state.baseCurrency = userCurrency; localStorage.setItem('baseCurr', userCurrency);
            if (!state.favs.includes(userCurrency)) { state.favs.push(userCurrency); localStorage.setItem('favs_v9', JSON.stringify(state.favs)); }
            localStorage.setItem('user_currency_set', 'true');
        }
    } catch (err) {}
}

// --- API BAĞLANTISI ---
async function fetchData() { 
    try { 
        const res = await fetch('/api/forex'); const data = await res.json(); 
        if(data.results) state.rates = data.results; else state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0};
        try { const g = await fetch('/api/gold'); const gd = await g.json(); state.rates['XAU']=1/gd.XAU; state.rates['XAG']=1/gd.XAG; } catch(e){ state.rates['XAU']=1/2650; state.rates['XAG']=1/31; }
    } catch(e) { state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0, 'XAU': 1/2650, 'XAG': 1/31}; } 
}

// --- GRAFİK AÇMA ---
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
    let tvSymbol = symbol==='USD'?"FX:EURUSD":(symbol==='XAU'?"OANDA:XAUUSD":(symbol==='BTC'?"BINANCE:BTCUSDT":`FX:USD${symbol}`));
    if(window.TradingView) new TradingView.widget({ "autosize": true, "symbol": tvSymbol, "interval": "D", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "container_id": "tv-chart-container" });
}

// --- AI CHAT ---
function openProAIChat(symbol) {
    const price = getPrice(symbol).toFixed(4);
    let chatModal = document.getElementById('pro-chat-modal'); if(chatModal) chatModal.remove();
    chatModal = document.createElement('div'); chatModal.id = 'pro-chat-modal';
    chatModal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4';
    chatModal.innerHTML = `
        <div class="bg-white dark:bg-[#1e222d] w-full max-w-md h-[550px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative animate-fade-in-up">
            <div class="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
                <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><i data-lucide="bot" size="24"></i></div><div><h3 class="font-bold text-base">Grafer Pro Ai</h3><p class="text-[10px] opacity-80 uppercase tracking-wide">Online • Global</p></div></div>
                <button onclick="document.getElementById('pro-chat-modal').remove()" class="hover:text-gray-200 cursor-pointer p-2"><i data-lucide="x" size="24"></i></button>
            </div>
            <div id="pro-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-black/20 text-sm"></div>
            <div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e222d] flex gap-2 shrink-0">
                <input type="text" id="pro-chat-input" placeholder="..." class="flex-1 bg-slate-100 dark:bg-black/10 border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" onkeypress="handleProEnter(event)">
                <button onclick="sendProMessage()" class="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition cursor-pointer"><i data-lucide="send" size="20"></i></button>
            </div>
        </div>`;
    document.body.appendChild(chatModal); lucide.createIcons();
    addProMessage(`Grafer Pro AI: Ready! Analyzing ${symbol}...`, 'bot', true);
    askOpenAI(`${symbol} (Price: ${price}) technical analysis.`, true);
}
function handleProEnter(e) { if(e.key === 'Enter') sendProMessage(); }
function sendProMessage() { const input = document.getElementById('pro-chat-input'); const msg = input.value.trim(); if(!msg) return; addProMessage(msg, 'user'); input.value = ''; askOpenAI(msg, false); }
async function askOpenAI(message, isInitial) {
    const container = document.getElementById('pro-chat-messages'); let loadingId = null; if(!isInitial) loadingId = addProMessage("...", 'bot', true);
    try {
        const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message }) });
        const data = await res.json(); if(loadingId) document.getElementById(loadingId).remove(); if(isInitial) container.innerHTML = ''; 
        if(data.reply) addProMessage(data.reply, 'bot'); else addProMessage("Error.", 'bot');
    } catch (e) { if(loadingId) document.getElementById(loadingId).remove(); addProMessage("Connection Error.", 'bot'); }
}
function addProMessage(text, sender, isLoading = false) {
    const container = document.getElementById('pro-chat-messages'); const div = document.createElement('div');
    div.className = sender === 'user' ? 'ml-auto bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm' : `bg-white dark:bg-cardDark text-slate-800 dark:text-white p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm border border-gray-100 dark:border-gray-700 ${isLoading ? 'animate-pulse text-indigo-500' : ''}`;
    div.innerText = text; container.appendChild(div); container.scrollTop = container.scrollHeight; return div.id = 'msg-' + Math.random();
}

// --- DİL VE HABERLER ---
function toggleLangMenu() { document.getElementById('lang-dropdown').classList.toggle('hidden'); document.getElementById('lang-dropdown').classList.toggle('flex'); }
function setLanguage(lang) {
    state.lang = lang; localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(I18N[lang][key]) el.innerText = I18N[lang][key]; });
    
    // --- [DÜZELTME 3]: ETİKETLERİ DÜZELT ---
    const dict = I18N[lang];
    const labels = document.querySelectorAll('#page-converter label');
    if(labels.length >= 3) {
        labels[0].innerText = dict.amount;
        labels[1].innerText = dict.source;
        labels[2].innerText = dict.target;
    }
    const resTitle = document.querySelector('#page-converter .text-indigo-400');
    if(resTitle) resTitle.innerText = dict.result;
    const resBtn = document.querySelector('#page-converter button[onclick*="value"]');
    if(resBtn) resBtn.innerText = dict.reset;

    document.getElementById('lang-dropdown').classList.add('hidden'); document.getElementById('lang-dropdown').classList.remove('flex');
    startNewsTicker(); updateLangIcon();
}
function startNewsTicker() { const c = document.getElementById('news-ticker'); const m = NEWS_DATA[state.lang] || NEWS_DATA['en']; c.innerHTML = m.map(x => `<a href="https://www.google.com/search?q=${encodeURIComponent(x)}&tbm=nws" target="_blank" class="ticker-item cursor-pointer hover:text-indigo-400 transition" style="text-decoration:none;"><span style="color:var(--theme-color)">●</span> ${x}</a>`).join(''); }

// --- TEMA VE UI ---
function getSymbol(c) { const s = {'PLN':'zł', 'USD':'$', 'EUR':'€', 'TRY':'₺', 'GBP':'£'}; return s[c] || c; }
function setTheme(c) { 
    state.theme = c; localStorage.setItem('theme', c); document.documentElement.style.setProperty('--theme-color', c);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    if(c==='#4f46e5') document.querySelectorAll('.theme-dot')[0]?.classList.add('active');
    else if(c==='#8b5cf6') document.querySelectorAll('.theme-dot')[1]?.classList.add('active');
    else if(c==='#10b981') document.querySelectorAll('.theme-dot')[2]?.classList.add('active');
    else if(c==='#f97316') document.querySelectorAll('.theme-dot')[3]?.classList.add('active');
    else if(c==='#ef4444') document.querySelectorAll('.theme-dot')[4]?.classList.add('active');
    initChart('mainChart', state.theme);
}
function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); }
function getFlagUrl(c) { return FLAG_MAP[c] ? `https://flagcdn.com/w80/${FLAG_MAP[c]}.png` : null; }
function getPrice(code) { let r = state.rates[code] || 1; if(code==='BTC') r=1/65000; return (1/r) * state.rates[state.baseCurrency]; }

// --- GRAFİKLER ---
function toggleVSMode() { if(state.vsPair) { state.vsPair = null; document.getElementById('vs-btn').classList.remove('bg-indigo-600', 'text-white'); } else { state.vsPair = 'BTC'; document.getElementById('vs-btn').classList.add('bg-indigo-600', 'text-white'); } initChart('mainChart', state.theme); startLiveSimulations(); }
function swapChart() { state.isChartSwapped = !state.isChartSwapped; startLiveSimulations(); }
function initChart(id, color) {
    const canvas = document.getElementById(id); if(!canvas) return;
    if(charts[id]) charts[id].destroy(); 
    const ctx = canvas.getContext('2d');
    let datasets = [{ label: id==='mainChart'?state.chartPair:state.cryptoChartPair, data: Array(20).fill(null), borderColor: color, borderWidth: 3, backgroundColor: createGradient(ctx, color), fill: true, tension: 0.4, pointRadius: 0 }];
    if(id==='mainChart' && state.vsPair) { datasets.push({ label: state.vsPair, data: Array(20).fill(null), borderColor: '#facc15', borderWidth: 3, borderDash: [5,5], fill: false, tension: 0.4, pointRadius: 0 }); }
    charts[id] = new Chart(ctx, { type: 'line', data: { labels: Array(20).fill(''), datasets: datasets }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, animation: { duration: 0 } } });
}
function createGradient(ctx, color) { const g = ctx.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, color + '55'); g.addColorStop(1, color + '00'); return g; }
function startLiveSimulations() {
    if(intervals['main']) clearInterval(intervals['main']); if(intervals['crypto']) clearInterval(intervals['crypto']);
    const mainChart = charts['mainChart'];
    if(mainChart) {
        let val1 = getPrice(state.chartPair); if(state.isChartSwapped) val1 = 1/val1;
        mainChart.data.datasets[0].data = Array(20).fill(val1).map(v => v * (1+(Math.random()-0.5)*0.01));
        intervals['main'] = setInterval(() => {
            const arr = mainChart.data.datasets[0].data; const val = arr[arr.length-1];
            arr.shift(); arr.push(val * (1 + (Math.random()-0.5)*0.005)); mainChart.update();
            const priceEl = document.getElementById('chart-price'); if(priceEl) priceEl.innerText = `${getSymbol(state.baseCurrency)} ${arr[arr.length-1].toLocaleString(undefined, {maximumFractionDigits:4})}`;
        }, 1000);
    }
    const cChart = charts['cryptoChart'];
    if(cChart) {
        const cVal = getPrice(state.cryptoChartPair); cChart.data.datasets[0].data = Array(20).fill(cVal).map(v => v * (1+(Math.random()-0.5)*0.01));
        intervals['crypto'] = setInterval(() => { const arr = cChart.data.datasets[0].data; const val = arr[arr.length-1]; arr.shift(); arr.push(val * (1 + (Math.random()-0.5)*0.01)); cChart.update(); document.getElementById('crypto-chart-price').innerText = `${getSymbol(state.baseCurrency)} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}`; }, 1000);
    }
    const flag = getFlagUrl(state.chartPair); const chartFlag = document.getElementById('chart-flag'); if(flag) { chartFlag.src = flag; chartFlag.style.display='block'; } else chartFlag.style.display='none'; document.getElementById('chart-symbol').innerHTML = state.isChartSwapped ? `<span class="base-curr-text">${state.baseCurrency}</span>/${state.chartPair}` : `${state.chartPair}/<span class="base-curr-text">${state.baseCurrency}</span>`; document.getElementById('crypto-chart-symbol').innerHTML = `${state.cryptoChartPair}/<span class="base-curr-text">${state.baseCurrency}</span>`; document.getElementById('crypto-chart-icon').src = `https://assets.coincap.io/assets/icons/${CRYPTO_ICONS[state.cryptoChartPair]||'btc'}@2x.png`;
}

// --- MENÜLER ---
function openSelector(mode) { state.drawerMode = mode; document.getElementById('selector-drawer').classList.remove('hidden'); setTimeout(() => document.getElementById('drawer-panel').classList.remove('translate-y-full'), 10); renderDrawerList(); }
function renderDrawerList() { 
    const list = document.getElementById('drawer-list');
    let items = state.drawerMode==='grid' ? [...Object.keys(FLAG_MAP), 'XAU'] : (state.drawerMode.includes('crypto') ? Object.keys(CRYPTO_ICONS) : Object.keys(state.rates));
    list.innerHTML = items.map(c => `<button onclick="handleSelection('${c}')" class="w-full text-left p-3 border-b border-gray-100 dark:border-white/5 font-bold flex items-center gap-2">${getFlagUrl(c)?`<img src="${getFlagUrl(c)}" class="w-6 rounded">`:''} ${c}</button>`).join(''); 
}
function handleSelection(c) {
    if(state.drawerMode==='from') { state.convFrom = c; updateConverterUI(); convert(); }
    else if(state.drawerMode==='to') { state.convTo = c; updateConverterUI(); convert(); }
    else if(state.drawerMode==='settings') { state.baseCurrency=c; localStorage.setItem('baseCurr',c); updateUI(); startLiveSimulations(); }
    else if(state.drawerMode==='chart-fiat') { state.chartPair=c; startLiveSimulations(); }
    else if(state.drawerMode==='chart-crypto') { state.cryptoChartPair=c; startLiveSimulations(); }
    closeAllDrawers();
}
function closeAllDrawers() { document.getElementById('drawer-panel').classList.add('translate-y-full'); setTimeout(() => document.getElementById('selector-drawer').classList.add('hidden'), 300); }

// --- ÇEVİRİCİ ---
function updateConverterUI() { 
    document.getElementById('code-from').innerText = state.convFrom; document.getElementById('code-to').innerText = state.convTo;
    const f1 = document.getElementById('flag-from'); if(f1) f1.src = getFlagUrl(state.convFrom);
    const f2 = document.getElementById('flag-to'); if(f2) f2.src = getFlagUrl(state.convTo);
}
function convert() { 
    const inp = document.getElementById('conv-amount'); const res = document.getElementById('conv-result');
    if(!inp || inp.value.trim() === '') { res.innerText = '---'; return; }
    const amt = parseFloat(inp.value); 
    const rate = state.rates[state.convTo] / state.rates[state.convFrom]; 
    res.innerText = `${(amt * rate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})} ${state.convTo}`; 
}
function swapCurrencies() { [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; updateConverterUI(); convert(); }

// --- NAV & GRID ---
function nav(p) { document.querySelectorAll('.page-section').forEach(x => x.classList.remove('active')); document.getElementById('page-'+p).classList.add('active'); if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const sb = document.getElementById('sidebar'); const o = document.getElementById('overlay'); const open = sb.style.transform === 'translateX(0px)'; sb.style.transform = open ? 'translateX(-100%)' : 'translateX(0px)'; o.classList.toggle('hidden', open); }

function renderGrid() { 
    const el = document.getElementById('dashboard-grid'); if(!el) return;
    el.innerHTML = state.favs.map(c => `<div onclick="openChartModal('${c}')" class="bg-white dark:bg-cardDark p-4 rounded-2xl neon-box shadow-sm border border-slate-100 dark:border-white/5 relative"><p class="font-bold text-xs text-slate-400">${c}/${state.baseCurrency}</p><p class="font-bold text-xl dark:text-white">${getPrice(c).toLocaleString(undefined, {maximumFractionDigits:3})}</p></div>`).join('');
}
function renderCryptoGrid() {
    const el = document.getElementById('crypto-grid'); if(!el) return;
    el.innerHTML = state.cryptoFavs.map(c => `<div onclick="openChartModal('${c}')" class="bg-white dark:bg-cardDark p-4 rounded-2xl neon-box shadow-sm border border-slate-100 dark:border-white/5 flex justify-between"><span class="font-bold dark:text-white">${c}</span><span class="font-bold">${getPrice(c).toLocaleString(undefined, {maximumFractionDigits:2})}</span></div>`).join('');
}
function renderPortfolio() {
    const list = document.getElementById('portfolio-list'); const totalEl = document.getElementById('portfolio-total');
    if(!list) return; let t = 0;
    list.innerHTML = state.portfolio.map((p,i) => { const v = getPrice(p.symbol)*p.amount; t+=v; return `<div class="flex justify-between p-3 border-b border-gray-100 dark:border-white/5"><span class="font-bold dark:text-white">${p.symbol} (${p.amount})</span><span>${v.toFixed(2)}</span></div>`; }).join('');
    if(totalEl) totalEl.innerText = t.toLocaleString(undefined, {maximumFractionDigits:2});
}
function openAddAssetSelector() { state.tempAsset = null; openSelector('add-asset'); }
function confirmAddAsset() { const inp = document.getElementById('asset-amount'); const amt = parseFloat(inp.value); if(amt>0 && state.tempAsset) { state.portfolio.push({symbol:state.tempAsset, amount:amt}); localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); document.getElementById('quantity-modal').classList.add('hidden'); renderPortfolio(); inp.value=''; } }
function clearPortfolio() { state.portfolio=[]; localStorage.setItem('portfolio', '[]'); renderPortfolio(); }
