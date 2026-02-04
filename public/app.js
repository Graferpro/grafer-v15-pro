// --- GLOBAL AYARLAR ---
// NOT: Eğer sunucudan anahtar gelmezse bu yedek anahtar çalışacak.
const FALLBACK_KEY = 'bd037c8df3-e9e9dee6a5-t9tvbi'; 

let API_KEY = ''; 
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

const I18N = {
    tr: { dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", reset: "Sıfırla", crypto_assets: "Kripto Varlıklar", theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", ai_title: "AI Analiz Asistanı", ai_subtitle: "Teknik Gösterge Analizi", close: "Kapat", analyzing: "Analiz ediliyor..." },
    en: { dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", reset: "Reset", crypto_assets: "Crypto Assets", theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", ai_title: "AI Assistant", ai_subtitle: "Technical Analysis", close: "Close", analyzing: "Analyzing..." },
    ru: { dark_mode: "Темная тема", dashboard: "Рынок", portfolio: "Портфель", crypto: "Крипто", converter: "Конвертер", settings: "Настройки", market: "Рынок", edit: "Изменить", total_asset: "ВСЕГО АКТИВОВ", add: "Добавить", reset: "Сброс", crypto_assets: "Криптоактивы", theme_color: "Цвет темы", default_currency: "Валюта по умолчанию", ai_analysis: "AI Анализ", ai_title: "AI Помощник", ai_subtitle: "Технический анализ", close: "Закрыть", analyzing: "Анализ..." },
    pl: { dark_mode: "Tryb ciemny", dashboard: "Rynek", portfolio: "Portfel", crypto: "Krypto", converter: "Przelicznik", settings: "Ustawienia", market: "Rynek", edit: "Edytuj", total_asset: "AKTYWA OGÓŁEM", add: "Dodaj", reset: "Reset", crypto_assets: "Aktywa Krypto", theme_color: "Kolor motywu", default_currency: "Domyślna Waluta", ai_analysis: "Analiza AI", ai_title: "Asystent AI", ai_subtitle: "Analiza Techniczna", close: "Zamknij", analyzing: "Analizowanie..." },
    ka: { dark_mode: "ღამის რეჟიმი", dashboard: "ბაზარი", portfolio: "პორტფოლიო", crypto: "კრიპტო", converter: "კონვერტორი", settings: "პარამეტრები", market: "ბაზარი", edit: "რედაქტირება", total_asset: "სულ აქტივები", add: "დამატება", reset: "განულება", crypto_assets: "კრიპტო აქტივები", theme_color: "თემის ფერი", default_currency: "ნაგულისხმევი ვალუტა", ai_analysis: "AI ანალიზი", ai_title: "AI ასისტენტი", ai_subtitle: "ტექნიკური ანალიზი", close: "დახურვა", analyzing: "ანალიზი..." }
};

const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Merkez Bankası faiz kararını açıkladı.", "Altın fiyatları rekor tazeledi.", "Teknoloji hisselerinde ralli var.", "Dolar endeksi kritik seviyede."],
    en: ["Bitcoin approaching 100K target.", "Central Bank announces rate decision.", "Gold prices hit new record.", "Tech stocks rallying today.", "Dollar index at critical level."],
    ru: ["Биткойн приближается к 100К.", "Центробанк объявил решение по ставке.", "Цены на золото побили рекорд.", "Акции технологических компаний растут.", "Индекс доллара на критическом уровне."],
    pl: ["Bitcoin zbliża się do 100 tys.", "Bank Centralny ogłosił decyzję o stopach.", "Ceny złota biją rekordy.", "Akcje technologiczne rosną.", "Indeks dolara na krytycznym poziomie."],
    ka: ["ბიტკოინი 100K ნიშნულს უახლოვდება.", "ცენტრალურმა ბანკმა განაკვეთი გამოაცხადა.", "ოქროს ფასმა რეკორდი მოხსნა.", "ტექნოლოგიური აქციები იზრდება.", "დოლარის ინდექსი კრიტიკულ დონეზეა."]
};

const AI_MESSAGES = {
    tr: ["RSI aşırı alım bölgesinde, düzeltme gelebilir.", "MACD al sinyali üretiyor, trend pozitif.", "Hacim artışı ile direnç kırıldı.", "Destek seviyesinden güçlü tepki alındı."],
    en: ["RSI is overbought, correction expected.", "MACD signaling buy, trend is positive.", "Resistance broken with high volume.", "Strong reaction from support level."],
    ru: ["RSI перекуплен, возможна коррекция.", "MACD дает сигнал на покупку.", "Сопротивление пробито с объемом.", "Сильная реакция от уровня поддержки."],
    pl: ["RSI wykupiony, możliwa korekta.", "MACD sygnalizuje kupno.", "Opór przełamany przy dużym wolumenie.", "Silna reakcja na poziomie wsparcia."],
    ka: ["RSI გადაჭარბებულია, მოსალოდნელია კორექცია.", "MACD ყიდვის სიგნალს იძლევა.", "წინააღმდეგობა გატეხილია.", "ძლიერი რეაქცია მხარდაჭერის დონეზე."]
};

let state = {
    rates: {}, baseCurrency: localStorage.getItem('baseCurr') || 'PLN', chartPair: 'USD', isChartSwapped: false, vsPair: null,
    lang: localStorage.getItem('lang') || 'auto', theme: localStorage.getItem('theme') || '#4f46e5',
    favs: JSON.parse(localStorage.getItem('favs_v8')) || ['USD', 'EUR', 'GBP', 'GEL'],
    cryptoFavs: JSON.parse(localStorage.getItem('crypto_v8')) || ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    drawerMode: '', neonEnabled: localStorage.getItem('neonEnabled') !== 'false', tempAsset: null, convFrom: 'USD', convTo: 'PLN',
    cryptoChartPair: 'BTC'
};

let charts = {}; let intervals = {};

// HATA AYIKLAMA KONSOLU (Sayfanın altında görünür)
const createDebugConsole = () => {
    const el = document.createElement('div');
    el.id = 'debug-console';
    el.style.cssText = 'position:fixed; bottom:0; left:0; width:100%; background:rgba(0,0,0,0.9); color:#00ff00; font-family:monospace; font-size:10px; max-height:80px; overflow-y:auto; z-index:9999; padding:5px; pointer-events:none; border-top:1px solid #00ff00; display:none;';
    document.body.appendChild(el);
    return el;
};
const debugLog = (msg) => {
    const el = document.getElementById('debug-console') || createDebugConsole();
    el.style.display = 'block'; // Hatayı göster
    el.innerHTML += `<div>> ${msg}</div>`;
    el.scrollTop = el.scrollHeight;
    console.log(msg);
};

window.onload = async () => {
    lucide.createIcons();
    initLanguage();
    setTheme(state.theme);
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');

    // --- API ANAHTAR YÖNETİMİ ---
    debugLog("Uygulama başlatılıyor...");
    try {
        debugLog("API Key sunucudan isteniyor...");
        const keyResponse = await fetch('/api/get-keys');
        if (keyResponse.ok) {
            const keys = await keyResponse.json();
            if(keys.API_KEY_FOREX) {
                API_KEY = keys.API_KEY_FOREX;
                debugLog("✅ API Key başarıyla alındı.");
            } else {
                debugLog("⚠️ Sunucudan boş anahtar geldi.");
            }
        } else {
            debugLog(`⚠️ Sunucu yanıt vermedi (Kod: ${keyResponse.status}).`);
        }
    } catch (error) {
        debugLog(`⚠️ Sunucu hatası: ${error.message}`);
    }

    // YEDEK ANAHTAR KONTROLÜ
    if (!API_KEY || API_KEY.length < 10) {
        debugLog("🔄 Yedek (Fallback) anahtar devreye alındı.");
        API_KEY = FALLBACK_KEY;
    }

    await fetchData();
    
    // UI Başlatma
    const neonToggle = document.getElementById('neon-toggle'); neonToggle.checked = state.neonEnabled;
    if(state.neonEnabled) document.body.classList.add('neon-active');
    neonToggle.addEventListener('change', (e) => { state.neonEnabled = e.target.checked; localStorage.setItem('neonEnabled', state.neonEnabled); if(state.neonEnabled) document.body.classList.add('neon-active'); else document.body.classList.remove('neon-active'); });
    if(state.baseCurrency === state.chartPair) state.chartPair = 'EUR';
    updateUI(); startLiveSimulations(); startNewsTicker();
    document.getElementById('theme-toggle').addEventListener('change', (e) => { document.documentElement.classList.toggle('dark', e.target.checked); });
};

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
    if(curr === 'PLN') return 'zł'; if(curr === 'USD') return '$'; if(curr === 'EUR') return '€'; if(curr === 'TRY') return '₺'; if(curr === 'GBP') return '£'; return curr;
}
function setTheme(color) {
    state.theme = color; localStorage.setItem('theme', color); document.documentElement.style.setProperty('--theme-color', color);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    if(color==='#4f46e5') document.querySelectorAll('.theme-dot')[0].classList.add('active');
    else if(color==='#8b5cf6') document.querySelectorAll('.theme-dot')[1].classList.add('active');
    else if(color==='#10b981') document.querySelectorAll('.theme-dot')[2].classList.add('active');
    else if(color==='#f97316') document.querySelectorAll('.theme-dot')[3].classList.add('active');
    else if(color==='#ef4444') document.querySelectorAll('.theme-dot')[4].classList.add('active');
    initChart('mainChart', state.theme); nav(document.querySelector('.page-section.active').id.replace('page-',''));
}

async function fetchData() { 
    if(!API_KEY) { debugLog("❌ Kritik Hata: API Anahtarı yok!"); return; }
    try { 
        debugLog("Veri çekiliyor...");
        const res = await fetch(`https://api.fastforex.io/fetch-all?api_key=${API_KEY}`); 
        if(!res.ok) throw new Error(`API Hatası: ${res.status}`);
        const data = await res.json(); 
        
        if(!data.results) throw new Error("API boş veri döndürdü.");
        
        state.rates = data.results; 
        debugLog("✅ Veriler başarıyla güncellendi.");
        // Başarılıysa konsolu gizle (3 saniye sonra)
        setTimeout(() => { 
            const el = document.getElementById('debug-console'); 
            if(el) el.style.display = 'none'; 
        }, 3000);

    } catch(e) { 
        debugLog(`❌ Veri Çekme Hatası: ${e.message}`);
        console.log("API Error", e); 
    } 
}

function updateUI() { 
    // Rates boşsa UI güncelleme
    if(Object.keys(state.rates).length === 0) return;
    updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); 
}
function getFlagUrl(code) { return FLAG_MAP[code] ? `https://flagcdn.com/w80/${FLAG_MAP[code]}.png` : null; }
function getPrice(code) { 
    if(!state.rates || Object.keys(state.rates).length === 0) return 0;
    let rateCode = state.rates[code]; 
    if(!rateCode) { 
        if(code==='BTC') rateCode = 1/65000; 
        else if(code==='ETH') rateCode = 1/3500; 
        else if(code==='SOL') rateCode = 1/140; 
        else if(code==='XRP') rateCode = 1/0.60; 
        else rateCode = 1; 
    } 
    // NaN koruması
    const baseRate = state.rates[state.baseCurrency] || 1;
    return (1 / rateCode) * baseRate; 
}
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
    if(val1 === 0) val1 = 1; // 0 gelirse grafik çökmesin
    if(state.isChartSwapped) val1 = 1/val1;
    const valVS = state.vsPair ? getPrice(state.vsPair) : 0;
    
    mainChart.data.datasets[0].data = Array(20).fill(val1).map(v => v * (1+(Math.random()-0.5)*0.01));
    if(state.vsPair) mainChart.data.datasets[1].data = Array(20).fill(valVS).map(v => v * (1+(Math.random()-0.5)*0.01));
    
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
    let cVal = getPrice(state.cryptoChartPair);
    if(cVal === 0) cVal = 50000; // Demo veri
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

function openAIModal() {
    document.getElementById('ai-modal').classList.remove('hidden');
    const content = document.getElementById('ai-content');
    content.innerHTML = `<span class="animate-pulse">${I18N[state.lang].analyzing || 'Analyzing...'}</span>`;
    setTimeout(() => {
        const msgs = AI_MESSAGES[state.lang] || AI_MESSAGES['en'];
        content.innerText = msgs[Math.floor(Math.random() * msgs.length)];
    }, 1500);
}

function openSelector(mode) {
    state.drawerMode = mode; document.getElementById('selector-drawer').classList.remove('hidden'); setTimeout(() => document.getElementById('drawer-panel').classList.remove('translate-y-full'), 10);
    const list = document.getElementById('drawer-list'); let items = []; let activeList = []; 
    if(mode === 'grid') { items = Object.keys(FLAG_MAP); activeList = state.favs; }
    else if (mode === 'settings') { items = Object.keys(state.rates).sort(); activeList = [state.baseCurrency]; }
    else if (mode === 'chart-fiat') { items = Object.keys(FLAG_MAP); activeList = [state.chartPair]; }
    else if (mode === 'crypto' || mode === 'chart-crypto') { items = Object.keys(CRYPTO_ICONS); activeList = mode==='chart-crypto' ? [state.cryptoChartPair] : state.cryptoFavs; }
    else if (mode === 'add-asset') { items = [...Object.keys(CRYPTO_ICONS), ...Object.keys(FLAG_MAP)]; activeList = []; }
    else if (mode === 'from' || mode === 'to') { items = Object.keys(state.rates).sort(); activeList = [state.convFrom, state.convTo]; }
    renderDrawerList(items, activeList, mode === 'settings' || mode.includes('chart') || mode === 'add-asset' || mode === 'from' || mode === 'to'); 
}

function renderDrawerList(items, activeList, isSingleSelect) {
    document.getElementById('drawer-list').innerHTML = items.map(c => {
        const isSel = activeList.includes(c); 
        let img = ''; let name = CURRENCY_NAMES[c] || c;
        if(CRYPTO_ICONS[c]) img = `<img src="https://assets.coincap.io/assets/icons/${CRYPTO_ICONS[c]}@2x.png" class="w-8 h-8 rounded-full object-cover bg-white">`;
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
        const listName = mode === 'grid' ? 'favs' : 'cryptoFavs'; const storageName = mode === 'grid' ? 'favs_v8' : 'crypto_v8';
        if(state[listName].includes(code)) state[listName] = state[listName].filter(x => x !== code); else state[listName].push(code);
        localStorage.setItem(storageName, JSON.stringify(state[listName])); updateUI(); openSelector(mode);
    }
}

function closeAllDrawers() { document.getElementById('drawer-panel').classList.add('translate-y-full'); setTimeout(() => document.getElementById('selector-drawer').classList.add('hidden'), 300); }
function filterDrawer() { const query = document.getElementById('search-input').value.toLowerCase(); const btns = document.getElementById('drawer-list').getElementsByTagName('button'); for(let btn of btns) { btn.style.display = btn.innerText.toLowerCase().includes(query) ? 'flex' : 'none'; } }

function confirmAddAsset() { const amt = parseFloat(document.getElementById('asset-amount').value); if(state.tempAsset && amt) { state.portfolio.push({symbol: state.tempAsset, amount: amt}); localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); document.getElementById('quantity-modal').classList.add('hidden'); renderPortfolio(); } }
function renderPortfolio() {
    const list = document.getElementById('portfolio-list'); const totalEl = document.getElementById('portfolio-total'); let totalVal = 0;
    const sym = getSymbol(state.baseCurrency);
    if(state.portfolio.length === 0) { list.innerHTML = `<div class="text-center p-10 text-slate-400"><i data-lucide="wallet" size="48" class="mx-auto mb-3 opacity-20"></i><p class="text-sm opacity-50">Empty / Boş</p></div>`; totalEl.innerText = "0.00"; } 
    else {
        list.innerHTML = state.portfolio.map((item, index) => { const price = getPrice(item.symbol); const val = price * item.amount; totalVal += val; return `<div class="bg-white dark:bg-cardDark p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-100 dark:border-white/5"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">${item.symbol}</div><div><p class="font-bold text-slate-800 dark:text-white">${item.symbol}</p><p class="text-xs text-slate-400">${item.amount}</p></div></div><div class="text-right"><p class="font-bold text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><button onclick="state.portfolio.splice(${index}, 1); localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); renderPortfolio();" class="text-red-400 text-xs mt-1">X</button></div></div>`; }).join('');
        totalEl.innerText = totalVal.toLocaleString(undefined, {maximumFractionDigits:2});
    } lucide.createIcons();
}

function openAddAssetSelector() { state.tempAsset = null; openSelector('add-asset'); }
function clearPortfolio() { state.portfolio = []; localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); renderPortfolio(); }
function updateBaseCurrencyUI() { 
    document.querySelectorAll('.base-curr-text').forEach(el => el.innerText = state.baseCurrency); 
    document.querySelectorAll('.base-curr-symbol').forEach(el => el.innerText = getSymbol(state.baseCurrency)); 
    document.getElementById('settings-code').innerText = state.baseCurrency; 
    const flagUrl = getFlagUrl(state.baseCurrency); const imgEl = document.getElementById('settings-flag'); const iconEl = document.getElementById('settings-globe-icon'); if (flagUrl) { imgEl.src = flagUrl; imgEl.style.display = 'block'; iconEl.classList.add('hidden'); } else { imgEl.style.display = 'none'; iconEl.classList.remove('hidden'); lucide.createIcons(); } 
}
function renderGrid() { const container = document.getElementById('dashboard-grid'); const sym = getSymbol(state.baseCurrency); container.innerHTML = state.favs.map(curr => { const val = getPrice(curr); const flagUrl = getFlagUrl(curr); const imgTag = flagUrl ? `<img src="${flagUrl}" class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 shadow-md">` : `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] border border-slate-200">${curr.substring(0,2)}</div>`; return `<div class="bg-white dark:bg-cardDark p-4 rounded-2xl neon-box card-pop flex flex-col gap-2 shadow-sm"><div class="flex justify-between items-start">${imgTag}<span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">+0.4%</span></div><div><p class="font-bold text-slate-500 text-xs">${curr}/${state.baseCurrency}</p><p class="font-bold text-xl text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:3})}</p></div></div>`; }).join(''); }
function renderCryptoGrid() { const container = document.getElementById('crypto-grid'); const sym = getSymbol(state.baseCurrency); container.innerHTML = state.cryptoFavs.map(c => { const val = getPrice(c); const icon = CRYPTO_ICONS[c] || 'btc'; return `<div class="bg-white dark:bg-cardDark p-5 rounded-[1.5rem] neon-box card-pop flex items-center justify-between gap-2 shadow-sm"><div class="flex items-center gap-3 flex-1 min-w-0"><img src="https://assets.coincap.io/assets/icons/${icon}@2x.png" class="w-10 h-10 rounded-full shadow-lg flex-shrink-0 bg-white object-cover" onerror="this.src='https://assets.coincap.io/assets/icons/btc@2x.png'"><div class="min-w-0"><span class="font-bold text-lg text-slate-800 dark:text-white block truncate">${c}</span><span class="text-xs text-slate-400 block truncate">Coin</span></div></div><div class="text-right flex-shrink-0"><p class="font-bold text-base text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><p class="text-[10px] text-green-500 font-medium">+1.2%</p></div></div>`; }).join(''); }
function updateConverterUI() { document.getElementById('code-from').innerText = state.convFrom; document.getElementById('code-to').innerText = state.convTo; const f1 = document.getElementById('flag-from'); const f2 = document.getElementById('flag-to'); const u1 = getFlagUrl(state.convFrom); const u2 = getFlagUrl(state.convTo); if(u1) { f1.src = u1; f1.style.display='block'; } else f1.style.display='none'; if(u2) { f2.src = u2; f2.style.display='block'; } else f2.style.display='none'; }
function convert() { const amt = parseFloat(document.getElementById('conv-amount').value) || 0; const rate = state.rates[state.convTo] / state.rates[state.convFrom]; const res = amt * rate; document.getElementById('conv-result').innerText = `${res.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})} ${state.convTo}`; }
function swapCurrencies() { [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; updateConverterUI(); convert(); }

function nav(page) { document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active')); document.getElementById('page-' + page).classList.add('active'); document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('text-[var(--theme-color)]', 'active'); b.classList.add('text-slate-400'); b.style.color = ''; }); const btn = document.getElementById('nav-' + page); if(btn) { btn.classList.add('text-[var(--theme-color)]', 'active'); btn.classList.remove('text-slate-400'); btn.style.color = state.theme; } if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const sb = document.getElementById('sidebar'); const isOpen = sb.style.transform === 'translateX(0px)'; sb.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)'; document.getElementById('overlay').classList.toggle('hidden', isOpen); }
