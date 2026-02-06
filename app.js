// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

const I18N = {
    tr: { dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", reset: "Sıfırla", crypto_assets: "Kripto Varlıklar", theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", ai_title: "AI Analiz Asistanı", ai_subtitle: "Teknik Gösterge Analizi", close: "Kapat", analyzing: "Analiz ediliyor..." },
    en: { dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", reset: "Reset", crypto_assets: "Crypto Assets", theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", ai_title: "AI Assistant", ai_subtitle: "Technical Analysis", close: "Close", analyzing: "Analyzing..." },
    ru: { dark_mode: "Темная тема", dashboard: "Рынок", portfolio: "Портфель", crypto: "Крипто", converter: "Конвертер", settings: "Настройки", market: "Рынок", edit: "Изменить", total_asset: "ВСЕГО АКТИВОВ", add: "Добавить", reset: "Сброс", crypto_assets: "Криптоактивы", theme_color: "Цвет темы", default_currency: "Валюта по умолчанию", ai_analysis: "AI Анализ", ai_title: "AI Помощник", ai_subtitle: "Технический анализ", close: "Закрыть", analyzing: "Анализ..." },
    pl: { dark_mode: "Tryb ciemny", dashboard: "Rynek", portfolio: "Portfel", crypto: "Krypto", converter: "Przelicznik", settings: "Ustawienia", market: "Rynek", edit: "Edytuj", total_asset: "AKTYWA OGÓŁEM", add: "Dodaj", reset: "Reset", crypto_assets: "Aktywa Krypto", theme_color: "Kolor motywu", default_currency: "Domyślna Waluta", ai_analysis: "Analiza AI", ai_title: "Asystent AI", ai_subtitle: "Analiza Techniczna", close: "Zamknij", analyzing: "Analizowanie..." },
    ka: { dark_mode: "ღამის რეჟიმი", dashboard: "ბაზარი", portfolio: "პორტფოლიო", crypto: "კრიპტო", converter: "კონვერტორი", settings: "პარამეტრები", market: "ბაზარი", edit: "რედაქტირება", total_asset: "სულ აქტივები", add: "დამატება", reset: "განულება", crypto_assets: "კრიპტო აქტივები", theme_color: "თემის ფერი", default_currency: "ნაგულისხმევი ვალუტა", ai_analysis: "AI ანალიზი", ai_title: "AI ასისტენტი", ai_subtitle: "ტექნიკური ანალიზი", close: "დახურვა", analyzing: "ანალიზი..." }
};

const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Altın fiyatları rekor tazeledi.", "Merkez Bankası faiz kararını açıkladı.", "Teknoloji hisselerinde ralli var.", "Dolar endeksi kritik seviyede."],
    en: ["Bitcoin approaching 100K target.", "Gold prices hit new record.", "Central Bank announces rate decision.", "Tech stocks rallying today.", "Dollar index at critical level."]
};

const AI_MESSAGES = {
    tr: ["RSI aşırı alım bölgesinde, düzeltme gelebilir.", "MACD al sinyali üretiyor, trend pozitif.", "Hacim artışı ile direnç kırıldı.", "Destek seviyesinden güçlü tepki alındı."],
    en: ["RSI is overbought, correction expected.", "MACD signaling buy, trend is positive.", "Resistance broken with high volume.", "Strong reaction from support level."]
};

// --- STATE VE BAŞLANGIÇ ---
let state = {
    rates: {}, baseCurrency: localStorage.getItem('baseCurr') || 'PLN', chartPair: 'USD', isChartSwapped: false, vsPair: null,
    lang: localStorage.getItem('lang') || 'auto', theme: localStorage.getItem('theme') || '#4f46e5',
    favs: JSON.parse(localStorage.getItem('favs_v9')) || ['XAU', 'XAG', 'USD', 'EUR', 'GBP'],
    cryptoFavs: JSON.parse(localStorage.getItem('crypto_v8')) || ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    drawerMode: '', neonEnabled: localStorage.getItem('neonEnabled') !== 'false', tempAsset: null, convFrom: 'USD', convTo: 'PLN',
    cryptoChartPair: 'BTC'
};
let charts = {}; let intervals = {};

window.onload = async () => {
    lucide.createIcons();
    initLanguage();
    setTheme(state.theme);
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');
    
    // Chatbot'u başlat
    initChatBot(); 
   
    // 1. Önce Verileri Çek
    await fetchData(); 
    
    // --- OTOMATİK ÜLKE VE PARA BİRİMİ TANIMA ---
    if (!localStorage.getItem('user_location_set')) {
        try {
            const geoRes = await fetch('https://ipapi.co/json/');
            const geoData = await geoRes.json();
            const userCurrency = geoData.currency; 
            
            if (userCurrency && state.rates[userCurrency]) {
                if (!state.favs.includes(userCurrency)) {
                    state.favs.push(userCurrency);
                    localStorage.setItem('favs_v9', JSON.stringify(state.favs));
                    localStorage.setItem('baseCurr', userCurrency);
                    state.baseCurrency = userCurrency;
                }
            }
            localStorage.setItem('user_location_set', 'true');
        } catch (err) {
            console.log("Konum bulunamadı, varsayılan devam ediliyor.");
        }
    }

    const neonToggle = document.getElementById('neon-toggle'); neonToggle.checked = state.neonEnabled;
    if(state.neonEnabled) document.body.classList.add('neon-active');
    neonToggle.addEventListener('change', (e) => { state.neonEnabled = e.target.checked; localStorage.setItem('neonEnabled', state.neonEnabled); if(state.neonEnabled) document.body.classList.add('neon-active'); else document.body.classList.remove('neon-active'); });

    if(state.baseCurrency === state.chartPair) state.chartPair = 'EUR';
    updateUI(); startLiveSimulations(); startNewsTicker();
    
    // TradingView scriptini yükle
    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);

    document.getElementById('theme-toggle').addEventListener('change', (e) => { document.documentElement.classList.toggle('dark', e.target.checked); });
};

// --- API BAĞLANTISI ---
async function fetchData() { 
    try { 
        const res = await fetch('/api/forex'); 
        const data = await res.json(); 
        
        if(data.results) {
            state.rates = data.results; 
        } else {
             state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0};
        }

        try {
            const goldRes = await fetch('/api/gold');
            if (!goldRes.ok) throw new Error("API Hatası");
            const goldData = await goldRes.json();
            
            if(goldData.XAU) {
                state.rates['XAU'] = 1 / goldData.XAU; 
                state.rates['XAG'] = 1 / goldData.XAG; 
            } else { throw new Error("Veri yok"); }
        } catch (goldErr) {
            console.log("Altın API hatası, Demo Modu aktif:", goldErr);
            state.rates['XAU'] = 1 / 2650.50; 
            state.rates['XAG'] = 1 / 31.20;
        }

    } catch(e) { 
        console.log("Genel Hata:", e); 
        state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0, 'XAU': 1/2650, 'XAG': 1/31};
    } 
}

// --- YARDIMCI FONKSİYONLAR ---
function initLanguage() {
    if(state.lang === 'auto') { const navLang = navigator.language.slice(0, 2); state.lang = ['tr','en','ru','pl','ka'].includes(navLang) ? navLang : 'en'; }
    setLanguage(state.lang);
}
function toggleLangMenu() { document.getElementById('lang-dropdown').classList.toggle('hidden'); document.getElementById('lang-dropdown').classList.toggle('flex'); }
function setLanguage(lang) {
    state.lang = lang; localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(I18N[lang][key]) el.innerText = I18N[lang][key]; });
    document.getElementById('lang-dropdown').classList.add('hidden'); document.getElementById('lang-dropdown').classList.remove('flex');
    startNewsTicker();
}
function startNewsTicker() {
    const container = document.getElementById('news-ticker');
    const msgs = NEWS_DATA[state.lang] || NEWS_DATA['en'];
    container.innerHTML = msgs.map(m => `<div class="ticker-item"><span style="color:var(--theme-color)">●</span> ${m}</div>`).join('');
}
function getSymbol(curr) {
    const symbols = {'PLN':'zł', 'USD':'$', 'EUR':'€', 'TRY':'₺', 'GBP':'£'};
    return symbols[curr] || curr;
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
    const activeSection = document.querySelector('.page-section.active');
    if(activeSection) nav(activeSection.id.replace('page-',''));
}

function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); }
function getFlagUrl(code) { return FLAG_MAP[code] ? `https://flagcdn.com/w80/${FLAG_MAP[code]}.png` : null; }

function getPrice(code) { 
    let rateCode = state.rates[code]; 
    if(!rateCode) { 
        if(code==='BTC') rateCode = 1/65000; 
        else if(code==='ETH') rateCode = 1/3500; 
        else if(code==='SOL') rateCode = 1/140; 
        else if(code==='XRP') rateCode = 1/0.60; 
        else rateCode = 1; 
    } 
    return (1 / rateCode) * state.rates[state.baseCurrency]; 
}

// --- GRAFİK VE SİMÜLASYON ---
function toggleVSMode() { if(state.vsPair) { state.vsPair = null; document.getElementById('vs-btn').classList.remove('bg-indigo-600', 'text-white'); } else { state.vsPair = 'BTC'; document.getElementById('vs-btn').classList.add('bg-indigo-600', 'text-white'); } initChart('mainChart', state.theme); startLiveSimulations(); }
function swapChart() { state.isChartSwapped = !state.isChartSwapped; startLiveSimulations(); }

function initChart(id, color) {
    if(charts[id]) charts[id].destroy(); const ctx = document.getElementById(id).getContext('2d');
    let datasets = [{ label: id==='mainChart'?state.chartPair:state.cryptoChartPair, data: Array(20).fill(null), borderColor: color, borderWidth: 3, backgroundColor: createGradient(ctx, color), fill: true, tension: 0.4, pointRadius: 0 }];
    if(id==='mainChart' && state.vsPair) { datasets.push({ label: state.vsPair, data: Array(20).fill(null), borderColor: '#facc15', borderWidth: 3, borderDash: [5,5], fill: false, tension: 0.4, pointRadius: 0 }); }
    charts[id] = new Chart(ctx, { type: 'line', data: { labels: Array(20).fill(''), datasets: datasets }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, animation: { duration: 0 } } });
}
function createGradient(ctx, color) { const g = ctx.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, color + '55'); g.addColorStop(1, color + '00'); return g; }

function startLiveSimulations() {
    if(intervals['main']) clearInterval(intervals['main']);
    const mainChart = charts['mainChart'];
    let val1 = getPrice(state.chartPair); 
    if(state.isChartSwapped) val1 = 1/val1;
    const valVS = state.vsPair ? getPrice(state.vsPair) : 0;
    
    mainChart.data.datasets[0].data = Array(20).fill(val1).map(v => v * (1+(Math.random()-0.5)*0.01));
    if(state.vsPair) mainChart.data.datasets[1].data = Array(20).fill(valVS).map(v * (1+(Math.random()-0.5)*0.01));
    
    intervals['main'] = setInterval(() => {
        const arr1 = mainChart.data.datasets[0].data; const next1 = arr1[arr1.length-1] * (1 + (Math.random()-0.5)*0.005); arr1.shift(); arr1.push(next1);
        if(state.vsPair) { const arr2 = mainChart.data.datasets[1].data; const next2 = arr2[arr2.length-1] * (1 + (Math.random()-0.5)*0.01); arr2.shift(); arr2.push(next2); }
        mainChart.update();
        const sym = state.isChartSwapped ? state.chartPair : getSymbol(state.baseCurrency);
        document.getElementById('chart-price').innerText = `${sym} ${next1.toLocaleString(undefined, {maximumFractionDigits:4})}`;
        
        if(state.isChartSwapped) {
                document.getElementById('chart-symbol').innerHTML = `<span class="base-curr-text">${state.baseCurrency}</span>/${state.chartPair}`;
        } else {
                document.getElementById('chart-symbol').innerHTML = `${state.chartPair}/<span class="base-curr-text">${state.baseCurrency}</span>`;
        }
    }, 1000);
    
    if(intervals['crypto']) clearInterval(intervals['crypto']);
    const cChart = charts['cryptoChart'];
    const cVal = getPrice(state.cryptoChartPair);
    cChart.data.datasets[0].data = Array(20).fill(cVal).map(v => v * (1+(Math.random()-0.5)*0.01));
    intervals['crypto'] = setInterval(() => {
        const arr = cChart.data.datasets[0].data; const next = arr[arr.length-1] * (1 + (Math.random()-0.5)*0.01);
        arr.shift(); arr.push(next); cChart.update();
        const sym = getSymbol(state.baseCurrency);
        document.getElementById('crypto-chart-price').innerText = `${sym} ${next.toLocaleString(undefined, {maximumFractionDigits:2})}`;
    }, 1000);
    
    const flag = getFlagUrl(state.chartPair); const chartFlag = document.getElementById('chart-flag');
    if(flag) { chartFlag.src = flag; chartFlag.style.display='block'; } else { chartFlag.style.display='none'; }
    document.getElementById('crypto-chart-symbol').innerHTML = `${state.cryptoChartPair}/<span class="base-curr-text">${state.baseCurrency}</span>`;
    document.getElementById('crypto-chart-icon').src = `https://assets.coincap.io/assets/icons/${CRYPTO_ICONS[state.cryptoChartPair]||'btc'}@2x.png`;
}

// --- 1. TEMİZ VE PROFESYONEL GRAFİK (AI YOK, SADECE GRAFİK) ---
function openChartModal(symbol) {
    let modal = document.getElementById('tv-modal');
    if(!modal) {
        modal = document.createElement('div');
        modal.id = 'tv-modal';
        // z-[40] yaptık, Chatbot (z-60) onun üstünde durabilsin diye
        modal.className = 'fixed inset-0 z-[40] hidden bg-black flex flex-col';
        modal.innerHTML = `
            <div class="flex justify-between items-center p-4 border-b border-gray-800 bg-[#131722]">
                <h3 id="tv-title" class="text-white font-bold text-lg">GRAFİK</h3>
                <button onclick="document.getElementById('tv-modal').classList.add('hidden')" class="text-gray-400 hover:text-white p-2 cursor-pointer"><i data-lucide="x" size="24"></i></button>
            </div>
            <div id="tv-chart-container" class="flex-1 w-full h-full bg-black relative"></div>
        `;
        document.body.appendChild(modal);
        lucide.createIcons();
    }

    modal.classList.remove('hidden');
    document.getElementById('tv-title').innerText = symbol + " / USD";

    // Sembol Seçimi
    let tvSymbol = "FX:EURUSD"; 
    if(symbol === 'USD') tvSymbol = "FX:EURUSD"; 
    else if(symbol === 'EUR') tvSymbol = "FX:EURUSD";
    else if(symbol === 'TRY') tvSymbol = "FX:USDTRY";
    else if(symbol === 'GBP') tvSymbol = "FX:GBPUSD"; 
    else if(symbol === 'AUD') tvSymbol = "FX:AUDUSD"; 
    else if(symbol === 'XAU') tvSymbol = "OANDA:XAUUSD"; 
    else if(symbol === 'XAG') tvSymbol = "OANDA:XAGUSD"; 
    else if(symbol === 'BTC') tvSymbol = "BINANCE:BTCUSDT";
    else if(symbol === 'ETH') tvSymbol = "BINANCE:ETHUSDT";
    else if(symbol === 'SOL') tvSymbol = "BINANCE:SOLUSDT";
    else if(symbol === 'XRP') tvSymbol = "BINANCE:XRPUSDT";
    else tvSymbol = `FX:USD${symbol}`;

    if(window.TradingView) {
        new TradingView.widget({
            "autosize": true, "symbol": tvSymbol, "interval": "D", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": "tr", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "hide_side_toolbar": false, "allow_symbol_change": true, "container_id": "tv-chart-container"
        });
    }
}

// --- 2. YENİ GRAFER AI CHATBOT (SAĞ ALT KÖŞE) ---
function initChatBot() {
    if(document.getElementById('chatbot-btn')) return;

    // 1. Yuvarlak Chat Butonu
    const btn = document.createElement('button');
    btn.id = 'chatbot-btn';
    btn.className = 'fixed bottom-6 right-6 z-[60] w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition transform hover:scale-110 active:scale-95';
    btn.innerHTML = '<i data-lucide="message-circle" size="28"></i>';
    btn.onclick = toggleChatWindow;
    document.body.appendChild(btn);

    // 2. Chat Penceresi (WhatsApp Tarzı)
    const win = document.createElement('div');
    win.id = 'chatbot-window';
    win.className = 'fixed bottom-24 right-6 z-[60] w-80 h-96 bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 hidden flex flex-col overflow-hidden';
    win.innerHTML = `
        <div class="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div class="flex items-center gap-2">
                <i data-lucide="bot" size="20"></i>
                <span class="font-bold">Grafer AI</span>
            </div>
            <button onclick="toggleChatWindow()" class="hover:text-gray-200"><i data-lucide="x" size="20"></i></button>
        </div>
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-black/20 text-sm">
            <div class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl max-w-[85%]">
                Merhaba! Ben Grafer AI. Piyasa, dolar, altın veya kripto hakkında ne sormak istersin? 🤖
            </div>
        </div>
        <div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e222d] flex gap-2">
            <input type="text" id="chat-input" placeholder="Bir soru sor..." class="flex-1 bg-slate-100 dark:bg-black/10 border-none rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" onkeypress="handleEnter(event)">
            <button onclick="sendChatMessage()" class="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"><i data-lucide="send" size="18"></i></button>
        </div>
    `;
    document.body.appendChild(win);
    lucide.createIcons();
}

function toggleChatWindow() {
    const w = document.getElementById('chatbot-window');
    w.classList.toggle('hidden');
    if(!w.classList.contains('hidden')) document.getElementById('chat-input').focus();
}

function handleEnter(e) { if(e.key === 'Enter') sendChatMessage(); }

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if(!msg) return;

    addMessage(msg, 'user');
    input.value = '';

    const loadingId = addMessage('Analiz yapıyorum...', 'bot', true);

    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        
        document.getElementById(loadingId).remove();
        
        if(data.reply) {
            addMessage(data.reply, 'bot');
        } else {
            addMessage("Bir hata oluştu, tekrar dene.", 'bot');
        }
    } catch (e) {
        document.getElementById(loadingId).remove();
        addMessage("Bağlantı hatası.", 'bot');
    }
}

function addMessage(text, sender, isLoading = false) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const id = 'msg-' + Math.random().toString(36).substr(2, 9);
    div.id = id;
    
    if (sender === 'user') {
        div.className = 'ml-auto bg-indigo-600 text-white p-3 rounded-tl-xl rounded-tr-xl rounded-bl-xl max-w-[85%] shadow-sm';
    } else {
        div.className = `bg-white dark:bg-cardDark text-slate-800 dark:text-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl max-w-[85%] shadow-sm border border-gray-100 dark:border-gray-700 ${isLoading ? 'animate-pulse text-indigo-500' : ''}`;
    }
    
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight; 
    return id;
}

// --- MENÜ VE PORTFÖY İŞLEMLERİ ---
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
        else if (c === 'XAU') img = `<div class="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white"><i data-lucide="coins" size="14"></i></div>`;
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
        if(existing) {
            existing.amount += amt;
        } else {
            state.portfolio.push({symbol: state.tempAsset, amount: amt}); 
        }
        localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); 
        document.getElementById('quantity-modal').classList.add('hidden'); 
        renderPortfolio();
        amtInput.value = ''; 
    } else {
        alert("Lütfen geçerli bir miktar girin.");
    }
}

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

function updateBaseCurrencyUI() { 
    document.querySelectorAll('.base-curr-text').forEach(el => el.innerText = state.baseCurrency); 
    document.querySelectorAll('.base-curr-symbol').forEach(el => el.innerText = getSymbol(state.baseCurrency)); 
    document.getElementById('settings-code').innerText = state.baseCurrency; 
    const flagUrl = getFlagUrl(state.baseCurrency); const imgEl = document.getElementById('settings-flag'); const iconEl = document.getElementById('settings-globe-icon'); if (flagUrl) { imgEl.src = flagUrl; imgEl.style.display = 'block'; iconEl.classList.add('hidden'); } else { imgEl.style.display = 'none'; iconEl.classList.remove('hidden'); lucide.createIcons(); } 
}
function renderGrid() { 
    const container = document.getElementById('dashboard-grid'); 
    const sym = getSymbol(state.baseCurrency); 
    
    if(state.rates['XAU'] && !state.favs.includes('XAU')) { state.favs.push('XAU'); }

    container.innerHTML = state.favs.map(curr => { 
        const val = getPrice(curr); 
        const flagUrl = getFlagUrl(curr);
        let imgTag = '';
        if (curr === 'XAU') imgTag = `<div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 border border-yellow-200"><i data-lucide="coins" size="16"></i></div>`;
        else if (curr === 'XAG') imgTag = `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><i data-lucide="disc" size="16"></i></div>`;
        else if (flagUrl) imgTag = `<img src="${flagUrl}" class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 shadow-md">`;
        else imgTag = `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] border border-slate-200">${curr.substring(0,2)}</div>`;
        
        return `
        <div onclick="openChartModal('${curr}')" class="relative cursor-pointer bg-white dark:bg-cardDark p-4 rounded-2xl neon-box card-pop flex flex-col gap-2 shadow-sm active:scale-95 transition group">
            <div class="absolute top-3 right-3 text-indigo-500 dark:text-indigo-400">
                <i data-lucide="maximize-2" size="16"></i>
            </div>
            <div class="flex justify-between items-start">${imgTag}<span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">+0.4%</span></div>
            <div><p class="font-bold text-slate-500 text-xs">${curr}/${state.baseCurrency}</p><p class="font-bold text-xl text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:3})}</p></div>
        </div>`; 
    }).join(''); 
    
    lucide.createIcons();
}

function renderCryptoGrid() { 
    const container = document.getElementById('crypto-grid'); const sym = getSymbol(state.baseCurrency); 
    container.innerHTML = state.cryptoFavs.map(c => { 
        const val = getPrice(c); const icon = CRYPTO_ICONS[c] || 'btc'; 
        return `<div onclick="openChartModal('${c}')" class="cursor-pointer bg-white dark:bg-cardDark p-5 rounded-[1.5rem] neon-box card-pop flex items-center justify-between gap-2 shadow-sm active:scale-95 transition"><div class="flex items-center gap-3 flex-1 min-w-0"><img src="https://assets.coincap.io/assets/icons/${icon}@2x.png" class="w-10 h-10 rounded-full shadow-lg flex-shrink-0 bg-white object-cover" onerror="this.src='https://assets.coincap.io/assets/icons/btc@2x.png'"><div class="min-w-0"><span class="font-bold text-lg text-slate-800 dark:text-white block truncate">${c}</span><span class="text-xs text-slate-400 block truncate">Coin</span></div></div><div class="text-right flex-shrink-0"><p class="font-bold text-base text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><p class="text-[10px] text-green-500 font-medium">+1.2%</p></div></div>`; 
    }).join(''); 
}

function updateConverterUI() { document.getElementById('code-from').innerText = state.convFrom; document.getElementById('code-to').innerText = state.convTo; const f1 = document.getElementById('flag-from'); const f2 = document.getElementById('flag-to'); const u1 = getFlagUrl(state.convFrom); const u2 = getFlagUrl(state.convTo); if(u1) { f1.src = u1; f1.style.display='block'; } else f1.style.display='none'; if(u2) { f2.src = u2; f2.style.display='block'; } else f2.style.display='none'; }
function convert() { const amt = parseFloat(document.getElementById('conv-amount').value) || 0; const rate = state.rates[state.convTo] / state.rates[state.convFrom]; const res = amt * rate; document.getElementById('conv-result').innerText = `${res.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})} ${state.convTo}`; }
function swapCurrencies() { [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; updateConverterUI(); convert(); }

function nav(page) { document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active')); document.getElementById('page-' + page).classList.add('active'); document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('text-[var(--theme-color)]', 'active'); b.classList.add('text-slate-400'); b.style.color = ''; }); const btn = document.getElementById('nav-' + page); if(btn) { btn.classList.add('text-[var(--theme-color)]', 'active'); btn.classList.remove('text-slate-400'); btn.style.color = state.theme; } if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const sb = document.getElementById('sidebar'); const isOpen = sb.style.transform === 'translateX(0px)'; sb.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)'; document.getElementById('overlay').classList.toggle('hidden', isOpen); }
