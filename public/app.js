// GLOBAL DEĞİŞKENLER
// Not: API Key artık burada değil, sunucuda gizli!
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

// DİL AYARLARI
const I18N = {
    tr: { dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", reset: "Sıfırla", crypto_assets: "Kripto Varlıklar", theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", ai_title: "AI Analiz Asistanı", ai_subtitle: "Teknik Gösterge Analizi", close: "Kapat", analyzing: "Analiz ediliyor..." },
    en: { dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", reset: "Reset", crypto_assets: "Crypto Assets", theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", ai_title: "AI Assistant", ai_subtitle: "Technical Analysis", close: "Close", analyzing: "Analyzing..." },
    ru: { dark_mode: "Темная тема", dashboard: "Рынок", portfolio: "Портфель", crypto: "Крипто", converter: "Конвертер", settings: "Настройки", market: "Рынок", edit: "Изменить", total_asset: "ВСЕГО АКТИВОВ", add: "Добавить", reset: "Сброс", crypto_assets: "Криптоактивы", theme_color: "Цвет темы", default_currency: "Валюта по умолчанию", ai_analysis: "AI Анализ", ai_title: "AI Помощник", ai_subtitle: "Технический анализ", close: "Закрыть", analyzing: "Анализ..." },
    pl: { dark_mode: "Tryb ciemny", dashboard: "Rynek", portfolio: "Portfel", crypto: "Krypto", converter: "Przelicznik", settings: "Ustawienia", market: "Rynek", edit: "Edytuj", total_asset: "AKTYWA OGÓŁEM", add: "Dodaj", reset: "Reset", crypto_assets: "Aktywa Krypto", theme_color: "Kolor motywu", default_currency: "Domyślna Waluta", ai_analysis: "Analiza AI", ai_title: "Asystent AI", ai_subtitle: "Analiza Techniczna", close: "Zamknij", analyzing: "Analizowanie..." },
    ka: { dark_mode: "ღამის რეჟიმი", dashboard: "ბაზარი", portfolio: "პორტფოლიო", crypto: "კრიპტო", converter: "კონვერტორი", settings: "პარამეტრები", market: "ბაზარი", edit: "რედაქტირება", total_asset: "სულ აქტივები", add: "დამატება", reset: "განულება", crypto_assets: "კრიპტო აქტივები", theme_color: "თემის ფერი", default_currency: "ნაგულისხმევი ვალუტა", ai_analysis: "AI ანალიზი", ai_title: "AI ასისტენტი", ai_subtitle: "ტექნიკური ანალიზი", close: "დახურვა", analyzing: "ანალიზი..." }
};

const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Merkez Bankası faiz kararını açıkladı.", "Altın fiyatları rekor tazeledi.", "Teknoloji hisselerinde ralli var.", "Dolar endeksi kritik seviyede."],
    en: ["Bitcoin approaching 100K target.", "Central Bank announces rate decision.", "Gold prices hit new record.", "Tech stocks rallying today.", "Dollar index at critical level."]
};

const AI_MESSAGES = {
    tr: ["RSI aşırı alım bölgesinde, düzeltme gelebilir.", "MACD al sinyali üretiyor, trend pozitif.", "Hacim artışı ile direnç kırıldı.", "Destek seviyesinden güçlü tepki alındı."],
    en: ["RSI is overbought, correction expected.", "MACD signaling buy, trend is positive.", "Resistance broken with high volume.", "Strong reaction from support level."]
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

// BAŞLANGIÇ
window.onload = async () => {
    lucide.createIcons();
    initLanguage();
    setTheme(state.theme);
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');

    // Verileri Proxy üzerinden çek
    await fetchData();

    const neonToggle = document.getElementById('neon-toggle'); neonToggle.checked = state.neonEnabled;
    if(state.neonEnabled) document.body.classList.add('neon-active');
    neonToggle.addEventListener('change', (e) => { state.neonEnabled = e.target.checked; localStorage.setItem('neonEnabled', state.neonEnabled); if(state.neonEnabled) document.body.classList.add('neon-active'); else document.body.classList.remove('neon-active'); });
    if(state.baseCurrency === state.chartPair) state.chartPair = 'EUR';
    updateUI(); startLiveSimulations(); startNewsTicker();
    document.getElementById('theme-toggle').addEventListener('change', (e) => { document.documentElement.classList.toggle('dark', e.target.checked); });
};

// --- DÜZELTİLMİŞ FETCH FONKSİYONU ---
async function fetchData() { 
    try { 
        console.log("Veri proxy üzerinden isteniyor...");
        const res = await fetch('/api/proxy'); // Direkt sunucuya soruyoruz
        
        if(!res.ok) throw new Error(`Sunucu Hatası: ${res.status}`);
        
        const data = await res.json(); 
        
        if(data.error) throw new Error(data.error);
        if(!data.results) throw new Error("Veri boş geldi");

        state.rates = data.results; 
        console.log("✅ Veriler Başarıyla Güncellendi!");
    } catch(e) { 
        console.error("Veri Çekme Hatası:", e);
    } 
}
// ------------------------------------

function initLanguage() {
    if(state.lang === 'auto') { const navLang = navigator.language.slice(0, 2); state.lang = ['tr','en','ru','pl','ka'].includes(navLang) ? navLang : 'en'; }
    setLanguage(state.lang);
}
function toggleLangMenu() { document.getElementById('lang-dropdown').classList.toggle('hidden'); document.getElementById('lang-dropdown').classList.toggle('flex'); }
function setLanguage(lang) {
    state.lang = lang; localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if(I18N[lang] && I18N[lang][key]) el.innerText = I18N[lang][key]; });
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
    initChart('mainChart', state.theme); 
    const activeSection = document.querySelector('.page-section.active');
    if(activeSection) nav(activeSection.id.replace('page-',''));
}
function updateUI() { 
    if(!state.rates || Object.keys(state.rates).length === 0) return;
    updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); 
}
function getFlagUrl(code) { return FLAG_MAP[code] ? `https://flagcdn.com/w80/${FLAG_MAP[code]}.png` : null; }
function getPrice(code) { 
    let rateCode = state.rates[code]; 
    if(!rateCode) { 
        if(code==='BTC') rateCode = 1/65000; else if(code==='ETH') rateCode = 1/3500; else if(code==='SOL') rateCode = 1/140; else if(code==='XRP') rateCode = 1/0.60; else rateCode = 1; 
    } 
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

funct
