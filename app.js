// --- VERSİYON (CACHE TEMİZLEME) ---
const APP_VERSION = '1.2'; 

// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

const I18N = {
    tr: { dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", reset: "Sıfırla", crypto_assets: "Kripto Varlıklar", theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", ai_title: "Grafer Pro Ai Asistan", ai_subtitle: "Piyasa Analizi", close: "Kapat", analyzing: "Analiz ediliyor..." },
    en: { dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", reset: "Reset", crypto_assets: "Crypto Assets", theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", ai_title: "Grafer Pro Ai Assistant", ai_subtitle: "Market Analysis", close: "Close", analyzing: "Analyzing..." },
    pl: { dark_mode: "Tryb ciemny", dashboard: "Rynek", portfolio: "Portfel", crypto: "Krypto", converter: "Przelicznik", settings: "Ustawienia", market: "Rynek", edit: "Edytuj", total_asset: "AKTYWA OGÓŁEM", add: "Dodaj", reset: "Reset", crypto_assets: "Aktywa Krypto", theme_color: "Kolor motywu", default_currency: "Domyślna Waluta", ai_analysis: "Analiza AI", ai_title: "Grafer Pro Ai Asystent", ai_subtitle: "Analiza Rynkowa", close: "Zamknij", analyzing: "Analizowanie..." }
};

const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Altın fiyatları rekor tazeledi.", "Merkez Bankası faiz kararını açıkladı.", "Teknoloji hisselerinde ralli var.", "Dolar endeksi kritik seviyede."],
    en: ["Bitcoin approaching 100K target.", "Gold prices hit new record.", "Central Bank announces rate decision.", "Tech stocks rallying today.", "Dollar index at critical level."],
    pl: ["Bitcoin zbliża się do poziomu 100 tys.", "Ceny złota biją nowe rekordy.", "Bank Centralny ogłasza decyzję ws. stóp.", "Akcje technologiczne rosną.", "Indeks dolara na krytycznym poziomie."]
};

// --- STATE ---
let state = {
    rates: {}, baseCurrency: 'USD', chartPair: 'USD', isChartSwapped: false, vsPair: null,
    lang: 'en', theme: '#4f46e5',
    favs: ['XAU', 'XAG', 'USD', 'EUR', 'GBP'],
    cryptoFavs: ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: [],
    drawerMode: '', neonEnabled: true, tempAsset: null, convFrom: 'USD', convTo: 'PLN',
    cryptoChartPair: 'BTC'
};
let charts = {}; let intervals = {};

// --- BAŞLANGIÇ (LOGIC FIXED) ---
window.onload = async () => {
    // 1. Sürüm Kontrolü (Cache Temizliği)
    if (localStorage.getItem('app_version') !== APP_VERSION) {
        localStorage.clear();
        localStorage.setItem('app_version', APP_VERSION);
        location.reload();
        return;
    }

    loadState(); // Kayıtlı ayarları yükle
    lucide.createIcons();
    
    // 2. DİL AYARI (TELEFON SİSTEMİNE GÖRE - ZORUNLU)
    // Eğer kullanıcı manuel değiştirmediyse, telefonun dilini al
    if (!localStorage.getItem('user_lang_set')) {
        const phoneLang = navigator.language.slice(0, 2); // 'tr', 'pl', 'en'
        state.lang = I18N[phoneLang] ? phoneLang : 'en'; 
        localStorage.setItem('lang', state.lang);
        localStorage.setItem('user_lang_set', 'true');
    }
    setLanguage(state.lang);

    setTheme(state.theme);
    
    // 3. GRAFİKLERİ BAŞLAT (Ana Sayfa Grafiği Geri Geldi)
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');

    // 4. VERİLERİ ÇEK ve KONUMU BUL
    await fetchData(); 
    await detectLocationCurrency(); 

    const neonToggle = document.getElementById('neon-toggle'); if(neonToggle) { neonToggle.checked = state.neonEnabled; neonToggle.addEventListener('change', (e) => { state.neonEnabled = e.target.checked; localStorage.setItem('neonEnabled', state.neonEnabled); document.body.classList.toggle('neon-active', state.neonEnabled); }); }
    if(state.neonEnabled) document.body.classList.add('neon-active');

    updateUI(); 
    startLiveSimulations(); // CANLI SİMÜLASYON BAŞLAT
    startNewsTicker();
    
    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);
    document.getElementById('theme-toggle').addEventListener('change', (e) => { document.documentElement.classList.toggle('dark', e.target.checked); });
};

function loadState() {
    state.baseCurrency = localStorage.getItem('baseCurr') || 'USD';
    state.theme = localStorage.getItem('theme') || '#4f46e5';
    state.lang = localStorage.getItem('lang') || 'en';
    if(localStorage.getItem('favs_v9')) state.favs = JSON.parse(localStorage.getItem('favs_v9'));
    if(localStorage.getItem('crypto_v8')) state.cryptoFavs = JSON.parse(localStorage.getItem('crypto_v8'));
    if(localStorage.getItem('portfolio')) state.portfolio = JSON.parse(localStorage.getItem('portfolio'));
    state.neonEnabled = localStorage.getItem('neonEnabled') !== 'false';
}

// --- KONUMDAN PARA BİRİMİ SEÇME (DİLDEN BAĞIMSIZ) ---
async function detectLocationCurrency() {
    if (localStorage.getItem('user_currency_set')) return;
    try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const localCurr = geoData.currency; // Örn: PLN
        
        if (localCurr && state.rates[localCurr]) {
            state.baseCurrency = localCurr; // Parayı değiştir
            localStorage.setItem('baseCurr', localCurr);
            if(!state.favs.includes(localCurr)) { state.favs.push(localCurr); localStorage.setItem('favs_v9', JSON.stringify(state.favs)); }
            localStorage.setItem('user_currency_set', 'true');
            updateUI();
        }
    } catch (err) { console.log("Konum hatası"); }
}

async function fetchData() { 
    try { 
        const res = await fetch('/api/forex'); const data = await res.json(); 
        if(data.results) state.rates = data.results; else state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0};
        try {
            const goldRes = await fetch('/api/gold'); const goldData = await goldRes.json();
            if(goldData.XAU) { state.rates['XAU'] = 1 / goldData.XAU; state.rates['XAG'] = 1 / goldData.XAG; }
        } catch (e) { state.rates['XAU'] = 1/2650; state.rates['XAG'] = 1/31; }
    } catch(e) { state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0, 'XAU': 1/2650, 'XAG': 1/31}; } 
}

// --- GRAFİK MODALI (TRADINGVIEW & SABİT BUTON) ---
function openChartModal(symbol) {
    let modal = document.getElementById('tv-modal');
    if(modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'tv-modal';
    // Z-Index 50 (Grafik Arkada)
    modal.className = 'fixed inset-0 z-[50] bg-black flex flex-col';
    modal.innerHTML = `
        <div class="flex justify-between items-center p-4 border-b border-gray-800 bg-[#131722] relative z-[60]">
            <h3 id="tv-title" class="text-white font-bold text-lg">GRAFİK</h3>
            <button onclick="document.getElementById('tv-modal').classList.add('hidden')" class="text-gray-400 hover:text-white p-2 cursor-pointer"><i data-lucide="x" size="24"></i></button>
        </div>
        
        <div id="tv-chart-container" class="flex-1 w-full h-full bg-black relative z-0 pb-20"></div>

        <div class="fixed bottom-0 left-0 w-full p-4 bg-[#131722]/90 backdrop-blur-md border-t border-gray-800 z-[100] flex justify-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
             <button onclick="openProAIChat('${symbol}')" class="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-lg transition transform active:scale-95 cursor-pointer">
                <i data-lucide="sparkles"></i> Grafer Pro Ai Asistan
             </button>
        </div>
    `;
    document.body.appendChild(modal);
    lucide.createIcons();

    document.getElementById('tv-title').innerText = symbol + " / USD";
    
    // TradingView Widget Başlat
    let tvSymbol = "FX:EURUSD"; 
    if(symbol === 'USD') tvSymbol = "FX:EURUSD"; 
    else if(symbol === 'EUR') tvSymbol = "FX:EURUSD";
    else if(symbol === 'TRY') tvSymbol = "FX:USDTRY";
    else if(symbol === 'GBP') tvSymbol = "FX:GBPUSD"; 
    else if(symbol === 'XAU') tvSymbol = "OANDA:XAUUSD"; 
    else if(symbol === 'BTC') tvSymbol = "BINANCE:BTCUSDT";
    else tvSymbol = `FX:USD${symbol}`;

    if(window.TradingView) {
        new TradingView.widget({
            "autosize": true, "symbol": tvSymbol, "interval": "D", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": state.lang, "toolbar_bg": "#f1f3f6", "enable_publishing": false, "hide_side_toolbar": false, "allow_symbol_change": true, "container_id": "tv-chart-container"
        });
    }
}

// --- PRO AI CHAT MODALI ---
function openProAIChat(symbol) {
    const price = getPrice(symbol).toFixed(4);
    
    let chatModal = document.getElementById('pro-chat-modal');
    if(chatModal) chatModal.remove();

    chatModal = document.createElement('div');
    chatModal.id = 'pro-chat-modal';
    // Z-Index 9999 (En Üst)
    chatModal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4';
    chatModal.innerHTML = `
        <div class="bg-white dark:bg-[#1e222d] w-full max-w-md h-[550px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden relative animate-fade-in-up">
            <div class="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <i data-lucide="bot" size="24"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-base">Grafer Pro Ai Asistan</h3>
                        <p class="text-[10px] opacity-80 uppercase tracking-wide">Online • ${state.lang.toUpperCase()}</p>
                    </div>
                </div>
                <button onclick="document.getElementById('pro-chat-modal').remove()" class="hover:text-gray-200 cursor-pointer p-2"><i data-lucide="x" size="24"></i></button>
            </div>
            <div id="pro-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-black/20 text-sm"></div>
            <div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e222d] flex gap-2 shrink-0">
                <input type="text" id="pro-chat-input" placeholder="..." class="flex-1 bg-slate-100 dark:bg-black/10 border-none rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" onkeypress="handleProEnter(event)">
                <button onclick="sendProMessage()" class="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition cursor-pointer"><i data-lucide="send" size="20"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(chatModal);
    lucide.createIcons();
    
    addProMessage(`Merhaba! Ben Grafer Pro. ${symbol} analizi yapmamı ister misin?`, 'bot', true);
    askOpenAI(`${symbol} (Fiyat: ${price}) teknik analizi`, true);
}

function handleProEnter(e) { if(e.key === 'Enter') sendProMessage(); }

function sendProMessage() {
    const input = document.getElementById('pro-chat-input');
    const msg = input.value.trim();
    if(!msg) return;
    addProMessage(msg, 'user');
    input.value = '';
    askOpenAI(msg, false);
}

async function askOpenAI(message, isInitial) {
    const container = document.getElementById('pro-chat-messages');
    let loadingId = null;
    if(!isInitial) loadingId = addProMessage("...", 'bot', true);

    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, lang: state.lang })
        });
        const data = await res.json();
        
        if(loadingId) document.getElementById(loadingId).remove();
        if(isInitial) container.innerHTML = ''; 

        if(data.reply) addProMessage(data.reply, 'bot');
        else addProMessage("Hata oluştu.", 'bot');
    } catch (e) {
        if(loadingId) document.getElementById(loadingId).remove();
        addProMessage("Bağlantı hatası.", 'bot');
    }
}

function addProMessage(text, sender, isLoading = false) {
    const container = document.getElementById('pro-chat-messages');
    const div = document.createElement('div');
    div.className = sender === 'user' 
        ? 'ml-auto bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm' 
        : `bg-white dark:bg-cardDark text-slate-800 dark:text-white p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm border border-gray-100 dark:border-gray-700 ${isLoading ? 'animate-pulse text-indigo-500' : ''}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight; 
    return div.id = 'msg-' + Math.random();
}

// --- UI GÜNCELLEME & CANLI GRAFİK (FIXED) ---
function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); }

function startLiveSimulations() {
    if(intervals['main']) clearInterval(intervals['main']);
    if(intervals['crypto']) clearInterval(intervals['crypto']);

    // Ana Grafik Canlandırma (Simülasyon)
    const mainChart = charts['mainChart'];
    const cChart = charts['cryptoChart'];
    
    // Veri yoksa başlatma
    if(!mainChart || !cChart) return;

    intervals['main'] = setInterval(() => {
        const arr = mainChart.data.datasets[0].data;
        const lastVal = arr[arr.length-1] || getPrice(state.chartPair);
        const nextVal = lastVal * (1 + (Math.random()-0.5)*0.005);
        arr.shift(); arr.push(nextVal);
        mainChart.update();
        document.getElementById('chart-price').innerText = `${getSymbol(state.baseCurrency)} ${nextVal.toLocaleString(undefined, {maximumFractionDigits:4})}`;
    }, 1000);

    intervals['crypto'] = setInterval(() => {
        const arr = cChart.data.datasets[0].data;
        const lastVal = arr[arr.length-1] || getPrice(state.cryptoChartPair);
        const nextVal = lastVal * (1 + (Math.random()-0.5)*0.01);
        arr.shift(); arr.push(nextVal);
        cChart.update();
        document.getElementById('crypto-chart-price').innerText = `${getSymbol(state.baseCurrency)} ${nextVal.toLocaleString(undefined, {maximumFractionDigits:2})}`;
    }, 1000);
}

function initChart(id, color) {
    const canvas = document.getElementById(id);
    if(!canvas) return; // Canvas yoksa çık
    if(charts[id]) charts[id].destroy();
    
    const ctx = canvas.getContext('2d');
    const startVal = id === 'mainChart' ? getPrice(state.chartPair) : getPrice(state.cryptoChartPair);
    
    charts[id] = new Chart(ctx, { 
        type: 'line', 
        data: { 
            labels: Array(20).fill(''), 
            datasets: [{ 
                data: Array(20).fill(startVal), 
                borderColor: color, borderWidth: 3, 
                backgroundColor: color + '33', fill: true, 
                tension: 0.4, pointRadius: 0 
            }] 
        }, 
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false } 
    });
}

function renderGrid() { 
    const container = document.getElementById('dashboard-grid'); 
    const sym = getSymbol(state.baseCurrency); 
    container.innerHTML = state.favs.map(curr => { 
        const val = getPrice(curr); 
        const flagUrl = getFlagUrl(curr);
        let imgTag = flagUrl ? `<img src="${flagUrl}" class="w-8 h-8 rounded-full shadow-md">` : `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">${curr.substring(0,2)}</div>`;
        if (curr === 'XAU') imgTag = `<div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 border border-yellow-200"><i data-lucide="coins" size="16"></i></div>`;
        
        return `<div onclick="openChartModal('${curr}')" class="relative cursor-pointer bg-white dark:bg-cardDark p-4 rounded-2xl neon-box card-pop flex flex-col gap-2 shadow-sm active:scale-95 transition group">
            <div class="absolute top-3 right-3 text-indigo-500"><i data-lucide="maximize-2" size="16"></i></div>
            <div class="flex justify-between items-start">${imgTag}<span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">+0.4%</span></div>
            <div><p class="font-bold text-slate-500 text-xs">${curr}/${state.baseCurrency}</p><p class="font-bold text-xl text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:3})}</p></div>
        </div>`; 
    }).join(''); 
    lucide.createIcons();
}
// Diğer yardımcı fonksiyonlar (renderCryptoGrid, renderPortfolio, nav, vb.) aynı kalabilir veya önceki koddan alınabilir.
// Yer darlığı nedeniyle sadece kritik olanları ekledim. Eski kodun alt kısımlarını (renderCryptoGrid'den sonrasını) koruyabilirsin.
// EĞER KOPYALA-YAPIŞTIRDA EKSİK KALIRSA SÖYLE, TAMAMINI ATAYIM.

function renderCryptoGrid() { 
    const container = document.getElementById('crypto-grid'); const sym = getSymbol(state.baseCurrency); 
    container.innerHTML = state.cryptoFavs.map(c => { 
        const val = getPrice(c); const icon = CRYPTO_ICONS[c] || 'btc'; 
        return `<div onclick="openChartModal('${c}')" class="cursor-pointer bg-white dark:bg-cardDark p-5 rounded-[1.5rem] neon-box card-pop flex items-center justify-between gap-2 shadow-sm active:scale-95 transition"><div class="flex items-center gap-3 flex-1 min-w-0"><img src="https://assets.coincap.io/assets/icons/${icon}@2x.png" class="w-10 h-10 rounded-full shadow-lg flex-shrink-0 bg-white object-cover" onerror="this.src='https://assets.coincap.io/assets/icons/btc@2x.png'"><div class="min-w-0"><span class="font-bold text-lg text-slate-800 dark:text-white block truncate">${c}</span><span class="text-xs text-slate-400 block truncate">Coin</span></div></div><div class="text-right flex-shrink-0"><p class="font-bold text-base text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><p class="text-[10px] text-green-500 font-medium">+1.2%</p></div></div>`; 
    }).join(''); 
}
function updateBaseCurrencyUI() { 
    document.querySelectorAll('.base-curr-text').forEach(el => el.innerText = state.baseCurrency); 
    document.querySelectorAll('.base-curr-symbol').forEach(el => el.innerText = getSymbol(state.baseCurrency)); 
    document.getElementById('settings-code').innerText = state.baseCurrency; 
    const flagUrl = getFlagUrl(state.baseCurrency); const imgEl = document.getElementById('settings-flag'); const iconEl = document.getElementById('settings-globe-icon'); if (flagUrl) { imgEl.src = flagUrl; imgEl.style.display = 'block'; iconEl.classList.add('hidden'); } else { imgEl.style.display = 'none'; iconEl.classList.remove('hidden'); lucide.createIcons(); } 
}
function updateConverterUI() { document.getElementById('code-from').innerText = state.convFrom; document.getElementById('code-to').innerText = state.convTo; const f1 = document.getElementById('flag-from'); const f2 = document.getElementById('flag-to'); const u1 = getFlagUrl(state.convFrom); const u2 = getFlagUrl(state.convTo); if(u1) { f1.src = u1; f1.style.display='block'; } else f1.style.display='none'; if(u2) { f2.src = u2; f2.style.display='block'; } else f2.style.display='none'; }
function convert() { const amt = parseFloat(document.getElementById('conv-amount').value) || 0; const rate = state.rates[state.convTo] / state.rates[state.convFrom]; const res = amt * rate; document.getElementById('conv-result').innerText = `${res.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})} ${state.convTo}`; }
function swapCurrencies() { [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; updateConverterUI(); convert(); }
function nav(page) { document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active')); document.getElementById('page-' + page).classList.add('active'); document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('text-[var(--theme-color)]', 'active'); b.classList.add('text-slate-400'); b.style.color = ''; }); const btn = document.getElementById('nav-' + page); if(btn) { btn.classList.add('text-[var(--theme-color)]', 'active'); btn.classList.remove('text-slate-400'); btn.style.color = state.theme; } if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const sb = document.getElementById('sidebar'); const isOpen = sb.style.transform === 'translateX(0px)'; sb.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)'; document.getElementById('overlay').classList.toggle('hidden', isOpen); }
function renderPortfolio() {
    const list = document.getElementById('portfolio-list'); const totalEl = document.getElementById('portfolio-total'); let totalVal = 0;
    const sym = getSymbol(state.baseCurrency);
    if(state.portfolio.length === 0) { list.innerHTML = `<div class="text-center p-10 text-slate-400"><i data-lucide="wallet" size="48" class="mx-auto mb-3 opacity-20"></i><p class="text-sm opacity-50">Empty / Boş</p></div>`; totalEl.innerText = "0.00"; } 
    else {
        list.innerHTML = state.portfolio.map((item, index) => { const price = getPrice(item.symbol); const val = price * item.amount; totalVal += val; return `<div class="bg-white dark:bg-cardDark p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-100 dark:border-white/5"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">${item.symbol}</div><div><p class="font-bold text-slate-800 dark:text-white">${item.symbol}</p><p class="text-xs text-slate-400">${item.amount}</p></div></div><div class="text-right"><p class="font-bold text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><button onclick="state.portfolio.splice(${index}, 1); localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); renderPortfolio();" class="text-red-400 text-xs mt-1">X</button></div></div>`; }).join('');
        totalEl.innerText = totalVal.toLocaleString(undefined, {maximumFractionDigits:2});
    } lucide.createIcons();
}
function clearPortfolio() { state.portfolio = []; localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); renderPortfolio(); }
function openSelector(mode) {
    state.drawerMode = mode; document.getElementById('selector-drawer').classList.remove('hidden'); setTimeout(() => document.getElementById('drawer-panel').classList.remove('translate-y-full'), 10);
    const list = document.getElementById('drawer-list'); let items = []; let activeList = []; 
    if(mode === 'grid') { items = [...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = state.favs; }
    else if (mode === 'settings') { items = Object.keys(state.rates).sort(); activeList = [state.baseCurrency]; }
    else if (mode === 'chart-fiat') { items = [...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = [state.chartPair]; }
    else if (mode === 'crypto' || mode === 'chart-crypto') { items = Object.keys(CRYPTO_ICONS); activeList = mode==='chart-crypto' ? [state.cryptoChartPair] : state.cryptoFavs; }
    else if (mode === 'add-asset') { items = [...Object.keys(CRYPTO_ICONS), ...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = []; }
    else if (mode === 'from' || mode === 'to') { items = Object.keys(state.rates).sort(); activeList = [state.convFrom, state.convTo]; }
    renderDrawerList(items, activeList, mode === 'settings' || mode.includes('chart') || mode === 'add-asset' || mode === 'from' || mode === 'to'); 
}
function renderDrawerList(items, activeList, isSingleSelect) {
    document.getElementById('drawer-list').innerHTML = items.map(c => {
        const isSel = activeList.includes(c); 
        let img = ''; let name = CURRENCY_NAMES[c] || c;
        if(CRYPTO_ICONS[c]) img = `<img src="https://assets.coincap.io/assets/icons/${CRYPTO_ICONS[c]}@2x.png" class="w-8 h-8 rounded-full object-cover bg-white">`;
        else if (c === 'XAU') img = `<div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-white"><i data-lucide="coins" size="14"></i></div>`;
        else if (c === 'XAG') img = `<div class="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white"><i data-lucide="disc" size="14"></i></div>`;
        else { const flagUrl = getFlagUrl(c); img = flagUrl ? `<img src="${flagUrl}" class="w-8 h-8 rounded-full shadow-sm border border-slate-100 object-cover">` : `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><i data-lucide="globe" size="16" class="text-slate-400"></i></div>`; }
        let icon = ''; 
        if (isSingleSelect && state.drawerMode !== 'add-asset') { icon = isSel ? `<i data-lucide="circle-dot" class="text-[${state.theme}]"></i>` : '<i data-lucide="circle" class="text-slate-300"></i>'; }
        else if (isSel) { icon = `<i data-lucide="check-circle" class="text-[${state.theme}] fill-indigo-100"></i>`; }
        return `<button onclick="handleSelection('${c}')" class="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl border-b border-gray-50 dark:border-white/5">${isSingleSelect && state.drawerMode!=='add-asset' ? icon : ''} ${img}<div class="flex-1 text-left"> <span class="font-bold text-lg text-slate-800 dark:text-white block">${c}</span> <span class="text-xs text-slate-400 font-medium">${name}</span> </div>${!isSingleSelect ? icon : ''}</button>`;
    }).join(''); lucide.createIcons();
}
function handleSelection(code) {
    const mode = state.drawerMode;
    if(mode === 'settings') { state.baseCurrency = code; localStorage.setItem('baseCurr', code); updateUI(); startLiveSimulations(); closeAllDrawers(); }
    else if(mode === 'chart-fiat') { state.chartPair = code; startLiveSimulations(); closeAllDrawers(); }
    else if(mode === 'chart-crypto') { state.cryptoChartPair = code; startLiveSimulations(); closeAllDrawers(); }
    else if(mode === 'from') { state.convFrom = code; updateConverterUI(); convert(); closeAllDrawers(); }
    else if(mode === 'to') { state.convTo = code; updateConverterUI(); convert(); closeAllDrawers(); }
    else if(mode === 'add-asset') { state.tempAsset = code; closeAllDrawers(); document.getElementById('qty-title').innerText = `${code} Miktarı`; document.getElementById('quantity-modal').classList.remove('hidden'); document.getElementById('asset-amount').focus(); }
    else {
        const listName = mode === 'grid' ? 'favs' : 'cryptoFavs'; const storageName = mode === 'grid' ? 'favs_v9' : 'crypto_v8';
        if(state[listName].includes(code)) state[listName] = state[listName].filter(x => x !== code); else state[listName].push(code);
        localStorage.setItem(storageName, JSON.stringify(state[listName])); updateUI(); openSelector(mode);
    }
}
function closeAllDrawers() { document.getElementById('drawer-panel').classList.add('translate-y-full'); setTimeout(() => document.getElementById('selector-drawer').classList.add('hidden'), 300); }
function filterDrawer() { const query = document.getElementById('search-input').value.toLowerCase(); const btns = document.getElementById('drawer-list').getElementsByTagName('button'); for(let btn of btns) { btn.style.display = btn.innerText.toLowerCase().includes(query) ? 'flex' : 'none'; } }
function openAddAssetSelector() { state.tempAsset = null; openSelector('add-asset'); }
function confirmAddAsset() { 
    const amtInput = document.getElementById('asset-amount');
    const amt = parseFloat(amtInput.value); 
    if(state.tempAsset && amt > 0) { 
        const existing = state.portfolio.find(p => p.symbol === state.tempAsset);
        if(existing) { existing.amount += amt; } else { state.portfolio.push({symbol: state.tempAsset, amount: amt}); }
        localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); document.getElementById('quantity-modal').classList.add('hidden'); renderPortfolio(); amtInput.value = ''; 
    } else { alert("Lütfen geçerli bir miktar girin."); }
}
function setTheme(color) {
    state.theme = color; localStorage.setItem('theme', color); document.documentElement.style.setProperty('--theme-color', color);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    if(color==='#4f46e5') document.querySelectorAll('.theme-dot')[0].classList.add('active');
    else if(color==='#8b5cf6') document.querySelectorAll('.theme-dot')[1].classList.add('active');
    else if(color==='#10b981') document.querySelectorAll('.theme-dot')[2].classList.add('active');
    else if(color==='#f97316') document.querySelectorAll('.theme-dot')[3].classList.add('active');
    else if(color==='#ef4444') document.querySelectorAll('.theme-dot')[4].classList.add('active');
    initChart('mainChart', state.theme);
}
