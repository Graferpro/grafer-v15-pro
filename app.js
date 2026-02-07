// --- GRAFER PRO CORE (v2.6 - AUTO FILL & LOCATION FIX) ---
const APP_VERSION = '2.6.5'; 

// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

// DİL DESTEĞİ
const I18N = {
    en: { dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", reset: "Reset", crypto_assets: "Crypto Assets", theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", ai_title: "Grafer Pro Ai Assistant", ai_subtitle: "Market Analysis", close: "Close", analyzing: "Analyzing...", enter_amount: "Enter Amount...", result: "RESULT", quantity_title: "Quantity", tools: "Tools", loan_calc: "Loan Calc", translator: "Translator", back: "Back", loan_amount: "Loan Amount", interest_rate: "Interest (%)", term_months: "Term (Months)", calculate: "CALCULATE", monthly_payment: "Monthly Payment", total_payment: "Total Payment", fast_translate: "Fast Translate", ai_translate: "AI Translate", clear: "CLEAR", auto: "Auto", rights: "All Rights Reserved." },
    tr: { dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", reset: "Sıfırla", crypto_assets: "Kripto Varlıklar", theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", ai_title: "Grafer Pro Ai Asistan", ai_subtitle: "Piyasa Analizi", close: "Kapat", analyzing: "Analiz ediliyor...", enter_amount: "Miktarı Girin...", result: "SONUÇ", quantity_title: "Miktar", tools: "Araçlar", loan_calc: "Kredi Hesapla", translator: "Çevirici", back: "Geri", loan_amount: "Kredi Tutarı", interest_rate: "Faiz (%)", term_months: "Vade (Ay)", calculate: "HESAPLA", monthly_payment: "Aylık Taksit", total_payment: "Toplam Ödeme", fast_translate: "Hızlı Çevir", ai_translate: "AI Çeviri", clear: "TEMİZLE", auto: "Otomatik", rights: "Tüm Hakları Saklıdır." },
    pl: { dark_mode: "Tryb ciemny", dashboard: "Rynek", portfolio: "Portfel", crypto: "Krypto", converter: "Przelicznik", settings: "Ustawienia", market: "Rynek", edit: "Edytuj", total_asset: "AKTYWA OGÓŁEM", add: "Dodaj", reset: "Reset", crypto_assets: "Aktywa Krypto", theme_color: "Kolor motywu", default_currency: "Domyślna Waluta", ai_analysis: "Analiza AI", ai_title: "Grafer Pro Ai Asystent", ai_subtitle: "Analiza Rynkowa", close: "Zamknij", analyzing: "Analizowanie...", enter_amount: "Wpisz kwotę...", result: "WYNIK", quantity_title: "Ilość", tools: "Narzędzia", loan_calc: "Kalkulator Kredytowy", translator: "Tłumacz", back: "Wstecz", loan_amount: "Kwota Kredytu", interest_rate: "Oprocentowanie", term_months: "Miesiące", calculate: "OBLICZ", monthly_payment: "Miesięczna Rata", total_payment: "Całkowita Płatność", fast_translate: "Szybkie Tłumaczenie", ai_translate: "Tłumaczenie AI", clear: "WYCZYŚĆ", auto: "Automatyczny", rights: "Wszelkie Prawa Zastrzeżone." },
    ru: { dark_mode: "Темная тема", dashboard: "Рынок", portfolio: "Портфель", crypto: "Крипто", converter: "Конвертер", settings: "Настройки", market: "Рынок", edit: "Изменить", total_asset: "ВСЕГО АКТИВОВ", add: "Добавить", reset: "Сброс", crypto_assets: "Криптоактивы", theme_color: "Цвет темы", default_currency: "Валюта по умолчанию", ai_analysis: "AI Анализ", ai_title: "Grafer Pro Ai Помощник", ai_subtitle: "Технический анализ", close: "Закрыть", analyzing: "Анализ...", enter_amount: "Введите сумму...", result: "РЕЗУЛЬТАТ", quantity_title: "Количество", tools: "Инструменты", loan_calc: "Кредитный калькулятор", translator: "Переводчик", back: "Назад", loan_amount: "Сумма кредита", interest_rate: "Процент (%)", term_months: "Срок (мес)", calculate: "РАССЧИТАТЬ", monthly_payment: "Ежемесячный платеж", total_payment: "Итоговая выплата", fast_translate: "Быстрый перевод", ai_translate: "AI Перевод", clear: "ОЧИСТИТЬ", auto: "Авто", rights: "Все права защищены." },
    ka: { dark_mode: "ღამის რეჟიმი", dashboard: "ბაზარი", portfolio: "პორტფოლიო", crypto: "კრიპტო", converter: "კონვერტერი", settings: "პარამეტრები", market: "ბაზარი", edit: "რედაქტირება", total_asset: "სულ აქტივები", add: "დამატება", reset: "განულება", crypto_assets: "კრიპტო აქტივები", theme_color: "თემის ფერი", default_currency: "ნაგულისხმევი ვალუტა", ai_analysis: "AI ანალიზი", ai_title: "Grafer Pro AI ასისტენტი", ai_subtitle: "ბაზრის ანალიზი", close: "დახურვა", analyzing: "ანალიზი...", enter_amount: "შეიყვანეთ თანხა...", result: "შედეგი", quantity_title: "რაოდენობა", tools: "ინსტრუმენტები", loan_calc: "სესხის კალკულატორი", translator: "მთარგმნელი", back: "უკან", loan_amount: "სესხის თანხა", interest_rate: "პროცენტი (%)", term_months: "ვადა (თვე)", calculate: "გამოთვლა", monthly_payment: "ყოველთვიური გადასახადი", total_payment: "სულ გადასახადი", fast_translate: "სწრაფი თარგმნა", ai_translate: "AI თარგმნა", clear: "გასუფთავება", auto: "ავტომატური", rights: "ყველა უფლება დაცულია." }
};

const FALLBACK_NEWS = { en: [{text: "Global markets update."}], tr: [{text: "Küresel piyasalar güncellendi."}] };

// --- STATE ---
let state = {
    rates: {}, baseCurrency: 'USD', chartPair: 'USD', isChartSwapped: false, vsPair: null,
    lang: 'en', theme: localStorage.getItem('theme') || '#4f46e5',
    // Varsayılan 5 tane. 6.yı aşağıda otomatik ekleyeceğiz.
    favs: ['XAU', 'XAG', 'USD', 'EUR', 'GBP'], 
    cryptoFavs: ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    drawerMode: '', neonEnabled: localStorage.getItem('neonEnabled') !== 'false', tempAsset: null, convFrom: 'USD', convTo: 'PLN',
    cryptoChartPair: 'BTC', liveNews: [] 
};
let charts = {}; let intervals = {};

window.onload = async () => {
    if (localStorage.getItem('app_version') !== APP_VERSION) { localStorage.clear(); localStorage.setItem('app_version', APP_VERSION); location.reload(); return; }
    if(window.lucide) lucide.createIcons();

    const browserLang = navigator.language.slice(0, 2);
    state.lang = localStorage.getItem('lang') || (I18N[browserLang] ? browserLang : 'en');
    setLanguage(state.lang);
    setTheme(state.theme);
    
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');
    
    await fetchData(); 
    await fetchRealNews();
    
    // --- 1. OTOMATİK KONUM VE BOŞ KUTU DOLDURMA ---
    await detectAndFill(); 

    const neonToggle = document.getElementById('neon-toggle'); 
    if(neonToggle) {
        neonToggle.checked = state.neonEnabled;
        if(state.neonEnabled) document.body.classList.add('neon-active');
        neonToggle.addEventListener('change', (e) => { state.neonEnabled = e.target.checked; localStorage.setItem('neonEnabled', state.neonEnabled); if(state.neonEnabled) document.body.classList.add('neon-active'); else document.body.classList.remove('neon-active'); });
    }

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 700); }
    }, 2000);

    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);
    document.getElementById('theme-toggle').addEventListener('change', (e) => { document.documentElement.classList.toggle('dark', e.target.checked); });
    
    updateUI(); startLiveSimulations();
};

async function fetchData() { 
    try { 
        // 2. GARANTİ VERİ KAYNAĞI (Key istemez)
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD'); 
        const data = await res.json(); 
        if(data.rates) state.rates = data.rates; 
        state.rates['XAU'] = 1 / 2745.50; 
        state.rates['XAG'] = 1 / 32.80;   
    } catch(e) { 
        state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0, 'GBP':0.77, 'XAU': 1/2740, 'XAG': 1/32.50}; 
    } 
}

// --- AKILLI DOLDURMA FONKSİYONU ---
async function detectAndFill() {
    let detectedCurr = 'USD';
    // Daha önce ayarlanmamışsa bul
    if (localStorage.getItem('baseCurr')) { 
        detectedCurr = localStorage.getItem('baseCurr'); 
    } else {
        try { 
            const geoRes = await fetch('https://ipapi.co/json/'); 
            const geoData = await geoRes.json(); 
            if (geoData.currency) detectedCurr = geoData.currency;
        } catch (err) {}
    }
    
    state.baseCurrency = detectedCurr;
    localStorage.setItem('baseCurr', detectedCurr);

    // Listede boş yer kalmasın diye kontrol et
    // Eğer Base Currency listedeyse (örn. USD), ekranda USD/USD görünmez, o yüzden 1 kutu boşalır.
    // O boşluğu JPY veya CHF ile dolduruyoruz.
    if(!state.favs.includes('JPY') && state.baseCurrency !== 'JPY') {
        state.favs.push('JPY');
    } else if (!state.favs.includes('CHF')) {
        state.favs.push('CHF');
    }
    
    updateUI();
}

function getPrice(code) { 
    let rateCode = state.rates[code]; 
    if(!rateCode) { 
        if(code==='BTC') rateCode = 1/97000; else if(code==='ETH') rateCode = 1/2700; else if(code==='XAU') rateCode = 1/2745.50; else if(code==='XAG') rateCode = 1/32.80; else rateCode = 1; 
    } 
    return (1 / rateCode) * state.rates[state.baseCurrency]; 
}

// --- GRID ÇİZİMİ (BOŞ KUTUYU ENGELLER) ---
function renderGrid() {
    const container = document.getElementById('dashboard-grid');
    if(!container) return;
    const sym = getSymbol(state.baseCurrency);
    
    // Kendisiyle çarpılmasın (TRY/TRY görünmesin)
    const validFavs = state.favs.filter(c => c !== state.baseCurrency);

    container.innerHTML = validFavs.map(curr => {
        const val = getPrice(curr);
        const flagUrl = getFlagUrl(curr);
        
        let imgTag = '';
        if (curr === 'XAU') imgTag = `<div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 border border-yellow-200"><i data-lucide="coins" size="20"></i></div>`; 
        else if (curr === 'XAG') imgTag = `<div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200"><i data-lucide="disc" size="20"></i></div>`; 
        else if (flagUrl) imgTag = `<img src="${flagUrl}" class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 shadow-md object-cover">`; 
        else imgTag = `<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">${curr.substring(0,2)}</div>`; 

        let formattedVal = val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 3});

        return `<div onclick="openChartModal('${curr}')" class="relative cursor-pointer bg-white dark:bg-cardDark p-4 rounded-2xl neon-box flex flex-col justify-between h-[140px] shadow-sm border border-slate-100 dark:border-white/5 active:scale-95 transition"><div class="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-lg bg-green-50 text-green-500 flex items-center gap-1">+0.4% <i data-lucide="trending-up" size="12"></i></div><div class="mb-2">${imgTag}</div><div><p class="font-bold text-slate-400 text-xs uppercase tracking-wide">${curr} / ${state.baseCurrency}</p><p class="font-bold text-xl text-slate-800 dark:text-white mt-1 font-mono">${sym} ${formattedVal}</p></div></div>`; 
    }).join(''); 
    
    if(window.lucide) lucide.createIcons(); 
}

// --- DİĞERLERİ (AYNI) ---
function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); }
function getSymbol(curr) { const symbols = {'PLN':'zł', 'USD':'$', 'EUR':'€', 'TRY':'₺', 'GBP':'£'}; return symbols[curr] || curr; }
function getFlagUrl(code) { return FLAG_MAP[code] ? `https://flagcdn.com/w80/${FLAG_MAP[code]}.png` : null; }
function setLanguage(lang) { state.lang = lang; localStorage.setItem('lang', lang); document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if(I18N[lang][k]) el.innerText = I18N[lang][k]; }); const d = document.getElementById('lang-dropdown'); if(d) d.classList.add('hidden'); }
function setTheme(color) { state.theme = color; localStorage.setItem('theme', color); document.documentElement.style.setProperty('--theme-color', color); }
function toggleLangMenu() { document.getElementById('lang-dropdown').classList.toggle('hidden'); }
function nav(p) { document.querySelectorAll('.page-section').forEach(x=>x.classList.remove('active')); document.getElementById('page-'+p).classList.add('active'); if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const s = document.getElementById('sidebar'); s.style.transform = s.style.transform === 'translateX(0px)' ? 'translateX(-100%)' : 'translateX(0px)'; document.getElementById('overlay').classList.toggle('hidden'); }
async function fetchRealNews() { try { const res = await fetch('/api/news'); const data = await res.json(); if(data.news) state.liveNews = data.news; } catch(e){} startNewsTicker(); }
function renderCryptoGrid() { const c = document.getElementById('crypto-grid'); if(!c) return; const s = getSymbol(state.baseCurrency); c.innerHTML = state.cryptoFavs.map(x => `<div onclick="openChartModal('${x}')" class="bg-white dark:bg-cardDark p-4 rounded-xl mb-2 flex justify-between items-center shadow-sm border border-slate-100 dark:border-white/5 active:scale-95 transition"><div class="flex items-center gap-3"><img src="https://assets.coincap.io/assets/icons/${CRYPTO_ICONS[x]||'btc'}@2x.png" class="w-8 h-8 rounded-full"><b>${x}</b></div><span class="font-mono font-bold text-slate-800 dark:text-white">${s} ${getPrice(x).toLocaleString(undefined, {maximumFractionDigits:2})}</span></div>`).join(''); }
function renderPortfolio() { const l = document.getElementById('portfolio-list'); if(!l) return; l.innerHTML = state.portfolio.map(x => `<div class="flex justify-between bg-white dark:bg-cardDark p-3 rounded-lg border border-slate-100 dark:border-white/5 mb-2"><span class="font-bold">${x.symbol}</span><span>${x.amount}</span></div>`).join(''); }
function updateBaseCurrencyUI() { const el = document.getElementById('settings-code'); if(el) el.innerText = state.baseCurrency; document.querySelectorAll('.base-curr-text').forEach(e=>e.innerText=state.baseCurrency); const f=getFlagUrl(state.baseCurrency); if(f) document.getElementById('settings-flag').src=f; }
function updateConverterUI() { document.getElementById('code-from').innerText = state.convFrom; document.getElementById('code-to').innerText = state.convTo; document.getElementById('flag-from').src=getFlagUrl(state.convFrom); document.getElementById('flag-to').src=getFlagUrl(state.convTo); }
function convert() { const i = document.getElementById('conv-amount'); if(i && i.value) { const res = (parseFloat(i.value) * state.rates[state.convTo] / state.rates[state.convFrom]).toFixed(2); document.getElementById('conv-result').innerText = res.toLocaleString(undefined, {maximumFractionDigits:2}) + ' ' + state.convTo; } }
function swapCurrencies() { [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; updateConverterUI(); convert(); }
function openSelector(mode) { state.drawerMode = mode; document.getElementById('selector-drawer').classList.remove('hidden'); setTimeout(()=>document.getElementById('drawer-panel').classList.remove('translate-y-full'),10); renderDrawerList(Object.keys(state.rates), [], false); }
function closeAllDrawers() { document.getElementById('drawer-panel').classList.add('translate-y-full'); setTimeout(()=>document.getElementById('selector-drawer').classList.add('hidden'),300); }
function renderDrawerList(items) { document.getElementById('drawer-list').innerHTML = items.map(x=>`<button onclick="handleSelection('${x}')" class="p-3 w-full text-left border-b flex items-center gap-3"><img src="${getFlagUrl(x)}" class="w-6 h-6 rounded-full"><b>${x}</b></button>`).join(''); }
function handleSelection(code) { if(state.drawerMode==='settings') { state.baseCurrency=code; localStorage.setItem('baseCurr',code); detectAndFill(); } else if(state.drawerMode==='from') { state.convFrom=code; updateConverterUI(); convert(); } else if(state.drawerMode==='to') { state.convTo=code; updateConverterUI(); convert(); } else if(state.drawerMode.includes('chart')) { state.chartPair=code; startLiveSimulations(); } closeAllDrawers(); }
function initChart(id, color) { const c = document.getElementById(id); if(!c) return; if(charts[id]) charts[id].destroy(); const ctx = c.getContext('2d'); charts[id] = new Chart(ctx, { type: 'line', data: { labels: Array(20).fill(''), datasets: [{ data: Array(20).fill(null), borderColor: color, borderWidth: 2, fill: true, backgroundColor: color+'20', tension: 0.4, pointRadius:0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: false }, scales: { x: { display: false }, y: { display: false } } } }); }
function startLiveSimulations() { if(intervals['main']) clearInterval(intervals['main']); const m = charts['mainChart']; if(m) { let v = getPrice(state.chartPair); m.data.datasets[0].data.fill(v); intervals['main'] = setInterval(()=>{ const d = m.data.datasets[0].data; d.shift(); d.push(d[d.length-1]*(1+(Math.random()-0.5)*0.005)); m.update(); document.getElementById('chart-price').innerText = getSymbol(state.baseCurrency) + ' ' + d[d.length-1].toLocaleString(undefined, {maximumFractionDigits:4}); }, 1000); } }
function openChartModal(s) { alert(s + " Detayları (Yakında)"); }
