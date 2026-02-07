// --- GRAFER PRO CORE (v3.4 FINAL) ---
// Haberler + Altın Fix + Splash Screen + Araçlar Desteği

const APP_VERSION = '3.4'; 

// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

// --- GENİŞLETİLMİŞ DİL DESTEĞİ (ARAÇLAR DAHİL) ---
const I18N = {
    en: { 
        dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", 
        market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", reset: "Reset", crypto_assets: "Crypto Assets", 
        theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", 
        ai_title: "Grafer Pro Ai Assistant", ai_subtitle: "Market Analysis", close: "Close", analyzing: "Analyzing...",
        enter_amount: "Enter Amount...", result: "RESULT", quantity_title: "Quantity",
        tools: "Tools", loan_calc: "Loan Calc", translator: "Translator", back: "Back",
        loan_amount: "Loan Amount", interest_rate: "Interest (%)", term_months: "Term (Months)", calculate: "CALCULATE",
        monthly_payment: "Monthly Payment", total_payment: "Total Payment",
        fast_translate: "Fast Translate", ai_translate: "AI Translate", clear: "CLEAR", auto: "Auto", rights: "All Rights Reserved."
    },
    tr: { 
        dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", 
        market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", reset: "Sıfırla", crypto_assets: "Kripto Varlıklar", 
        theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", 
        ai_title: "Grafer Pro Ai Asistan", ai_subtitle: "Piyasa Analizi", close: "Kapat", analyzing: "Analiz ediliyor...",
        enter_amount: "Miktarı Girin...", result: "SONUÇ", quantity_title: "Miktar",
        tools: "Araçlar", loan_calc: "Kredi Hesapla", translator: "Çevirici", back: "Geri",
        loan_amount: "Kredi Tutarı", interest_rate: "Faiz (%)", term_months: "Vade (Ay)", calculate: "HESAPLA",
        monthly_payment: "Aylık Taksit", total_payment: "Toplam Ödeme",
        fast_translate: "Hızlı Çevir", ai_translate: "AI Çeviri", clear: "TEMİZLE", auto: "Otomatik", rights: "Tüm Hakları Saklıdır."
    },
    pl: { 
        dark_mode: "Tryb ciemny", dashboard: "Rynek", portfolio: "Portfel", crypto: "Krypto", converter: "Przelicznik", settings: "Ustawienia", 
        market: "Rynek", edit: "Edytuj", total_asset: "AKTYWA OGÓŁEM", add: "Dodaj", reset: "Reset", crypto_assets: "Aktywa Krypto", 
        theme_color: "Kolor motywu", default_currency: "Domyślna Waluta", ai_analysis: "Analiza AI", 
        ai_title: "Grafer Pro Ai Asystent", ai_subtitle: "Analiza Rynkowa", close: "Zamknij", analyzing: "Analizowanie...",
        enter_amount: "Wpisz kwotę...", result: "WYNIK", quantity_title: "Ilość",
        tools: "Narzędzia", loan_calc: "Kalkulator Kredytowy", translator: "Tłumacz", back: "Wstecz",
        loan_amount: "Kwota Kredytu", interest_rate: "Oprocentowanie", term_months: "Miesiące", calculate: "OBLICZ",
        monthly_payment: "Miesięczna Rata", total_payment: "Całkowita Płatność",
        fast_translate: "Szybkie Tłumaczenie", ai_translate: "Tłumaczenie AI", clear: "WYCZYŚĆ", auto: "Automatyczny", rights: "Wszelkie Prawa Zastrzeżone."
    },
    ru: { 
        dark_mode: "Темная тема", dashboard: "Рынок", portfolio: "Портфель", crypto: "Крипто", converter: "Конвертер", settings: "Настройки", 
        market: "Рынок", edit: "Изменить", total_asset: "ВСЕГО АКТИВОВ", add: "Добавить", reset: "Сброс", crypto_assets: "Криптоактивы", 
        theme_color: "Цвет темы", default_currency: "Валюта по умолчанию", ai_analysis: "AI Анализ", 
        ai_title: "Grafer Pro Ai Помощник", ai_subtitle: "Технический анализ", close: "Закрыть", analyzing: "Анализ...",
        enter_amount: "Введите сумму...", result: "РЕЗУЛЬТАТ", quantity_title: "Количество",
        tools: "Инструменты", loan_calc: "Кредитный калькулятор", translator: "Переводчик", back: "Назад",
        loan_amount: "Сумма кредита", interest_rate: "Процент (%)", term_months: "Срок (мес)", calculate: "РАССЧИТАТЬ",
        monthly_payment: "Ежемесячный платеж", total_payment: "Итоговая выплата",
        fast_translate: "Быстрый перевод", ai_translate: "AI Перевод", clear: "ОЧИСТИТЬ", auto: "Авто", rights: "Все права защищены."
    },
    ka: { 
        dark_mode: "ღამის რეჟიმი", dashboard: "ბაზარი", portfolio: "პორტფოლიო", crypto: "კრიპტო", converter: "კონვერტერი", settings: "პარამეტრები", 
        market: "ბაზარი", edit: "რედაქტირება", total_asset: "სულ აქტივები", add: "დამატება", reset: "განულება", crypto_assets: "კრიპტო აქტივები", 
        theme_color: "თემის ფერი", default_currency: "ნაგულისხმევი ვალუტა", ai_analysis: "AI ანალიზი", 
        ai_title: "Grafer Pro AI ასისტენტი", ai_subtitle: "ბაზრის ანალიზი", close: "დახურვა", analyzing: "ანალიზი...",
        enter_amount: "შეიყვანეთ თანხა...", result: "შედეგი", quantity_title: "რაოდენობა",
        tools: "ინსტრუმენტები", loan_calc: "სესხის კალკულატორი", translator: "მთარგმნელი", back: "უკან",
        loan_amount: "სესხის თანხა", interest_rate: "პროცენტი (%)", term_months: "ვადა (თვე)", calculate: "გამოთვლა",
        monthly_payment: "ყოველთვიური გადასახადი", total_payment: "სულ გადასახადი",
        fast_translate: "სწრაფი თარგმნა", ai_translate: "AI თარგმნა", clear: "გასუფთავება", auto: "ავტომატური", rights: "ყველა უფლება დაცულია."
    }
};

// YEDEK HABERLER
const FALLBACK_NEWS = {
    en: [{text: "Global markets update."}, {text: "Bitcoin holds strong."}, {text: "Gold prices fluctuating."}, {text: "Grafer Pro v3.4 Live."}],
    tr: [{text: "Küresel piyasalarda son durum."}, {text: "Bitcoin güçlü duruyor."}, {text: "Altın fiyatlarında dalgalanma."}, {text: "Grafer Pro v3.4 Yayında."}],
    pl: [{text: "Aktualizacja rynków globalnych."}, {text: "Bitcoin trzyma się mocno."}, {text: "Ceny złota się wahają."}, {text: "Grafer Pro v3.4 Działa."}],
    ru: [{text: "Обновление мировых рынков."}, {text: "Биткойн держится уверенно."}, {text: "Цены на золото колеблются."}, {text: "Grafer Pro v3.4 доступен."}],
    ka: [{text: "გლობალური ბაზრების განახლება."}, {text: "ბიტკოინი მყარად დგას."}, {text: "ოქროს ფასების ცვალებადობა."}, {text: "Grafer Pro v3.4 მზადაა."}]
};

// --- STATE ---
let state = {
    rates: {}, baseCurrency: 'USD', chartPair: 'USD', isChartSwapped: false, vsPair: null,
    lang: 'en', theme: localStorage.getItem('theme') || '#4f46e5',
    favs: JSON.parse(localStorage.getItem('favs_v9')) || ['XAU', 'XAG', 'USD', 'EUR', 'GBP'],
    cryptoFavs: JSON.parse(localStorage.getItem('crypto_v8')) || ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    drawerMode: '', neonEnabled: localStorage.getItem('neonEnabled') !== 'false', tempAsset: null, convFrom: 'USD', convTo: 'PLN',
    cryptoChartPair: 'BTC',
    liveNews: [] 
};
let charts = {}; let intervals = {};

window.onload = async () => {
    if (localStorage.getItem('app_version') !== APP_VERSION) {
        localStorage.clear();
        localStorage.setItem('app_version', APP_VERSION);
        location.reload(); return;
    }

    if(window.lucide) lucide.createIcons();

    if (!localStorage.getItem('lang')) { state.lang = 'en'; localStorage.setItem('lang', 'en'); } 
    else { state.lang = localStorage.getItem('lang'); }
    
    setLanguage(state.lang);
    setTheme(state.theme);
    
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');
    
    await fetchData(); 
    await fetchRealNews(); 
    await detectLocationCurrency(); 

    const neonToggle = document.getElementById('neon-toggle'); 
    if(neonToggle) {
        neonToggle.checked = state.neonEnabled;
        if(state.neonEnabled) document.body.classList.add('neon-active');
        neonToggle.addEventListener('change', (e) => { state.neonEnabled = e.target.checked; localStorage.setItem('neonEnabled', state.neonEnabled); if(state.neonEnabled) document.body.classList.add('neon-active'); else document.body.classList.remove('neon-active'); });
    }

    if(document.getElementById('conv-amount')) document.getElementById('conv-amount').value = ''; 
    convert(); 

    if(state.baseCurrency === state.chartPair) state.chartPair = 'EUR';
    updateUI(); startLiveSimulations(); startNewsTicker();
    
    // SPLASH SCREEN KAPATMA (2 Saniye Sonra)
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if(splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 700); 
        }
    }, 2000);

    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) themeToggle.addEventListener('change', (e) => { document.documentElement.classList.toggle('dark', e.target.checked); });
};

// --- HABERLER ---
async function fetchRealNews() {
    try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (data.news && data.news.length > 0) state.liveNews = data.news;
        else state.liveNews = []; 
    } catch (e) { state.liveNews = []; }
    startNewsTicker();
}

function startNewsTicker() {
    const container = document.getElementById('news-ticker');
    if(!container) return;
    let msgs = state.liveNews.length > 0 ? state.liveNews : (FALLBACK_NEWS[state.lang] || FALLBACK_NEWS['en']);
    
    container.innerHTML = msgs.map(m => {
        if(m.url) {
            return `<a href="${m.url}" target="_blank" class="ticker-item hover:underline cursor-pointer"><span style="color:var(--theme-color); margin-right:5px;">●</span> ${m.text}</a>`;
        } else {
            return `<div class="ticker-item"><span style="color:var(--theme-color); margin-right:5px;">●</span> ${m.text}</div>`;
        }
    }).join('');
}

// --- DİL VE TEMA ---
function toggleLangMenu() { const menu = document.getElementById('lang-dropdown'); if(menu) { menu.classList.toggle('hidden'); menu.classList.toggle('flex'); } }

function setLanguage(lang) {
    state.lang = lang; localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => { 
        const key = el.getAttribute('data-i18n'); 
        if(I18N[lang][key]) el.innerText = I18N[lang][key]; 
    });
    
    const amtInput = document.getElementById('conv-amount');
    if(amtInput) amtInput.placeholder = I18N[lang].enter_amount;
    
    startNewsTicker();
    
    const menu = document.getElementById('lang-dropdown');
    if(menu) { menu.classList.add('hidden'); menu.classList.remove('flex'); }
}

function setTheme(color) {
    state.theme = color; localStorage.setItem('theme', color); document.documentElement.style.setProperty('--theme-color', color);
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    // Basit eşleştirme, id ile yapılabilir ama şimdilik sıra ile
    const dots = document.querySelectorAll('.theme-dot');
    if(dots.length > 0) {
        if(color==='#4f46e5') dots[0].classList.add('active'); 
        else if(color==='#8b5cf6') dots[1].classList.add('active'); 
        else if(color==='#10b981') dots[2].classList.add('active'); 
        else if(color==='#f97316') dots[3].classList.add('active'); 
        else if(color==='#ef4444') dots[4].classList.add('active');
    }
    initChart('mainChart', state.theme);
}

// --- CORE VERİLER ---
async function fetchData() { 
    try { 
        const res = await fetch('/api/forex'); const data = await res.json(); 
        if(data.results) state.rates = data.results; 
        else state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0, 'GBP': 0.77};

        try {
            const goldRes = await fetch('/api/gold'); const goldData = await goldRes.json();
            if(goldData.XAU && goldData.XAU > 0) { state.rates['XAU'] = 1 / goldData.XAU; state.rates['XAG'] = 1 / goldData.XAG; } 
            else { throw new Error("Gold data empty"); }
        } catch (e) { state.rates['XAU'] = 1 / 2740; state.rates['XAG'] = 1 / 32.50; }
    } catch(e) { 
        state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0, 'GBP':0.77, 'XAU': 1/2740, 'XAG': 1/32.50}; 
    } 
}

function getPrice(code) { 
    let rateCode = state.rates[code]; 
    if(!rateCode) { 
        if(code==='BTC') rateCode = 1/97000; else if(code==='ETH') rateCode = 1/2700; else if(code==='SOL') rateCode = 1/175; else if(code==='XRP') rateCode = 1/2.40; else if(code==='XAU') rateCode = 1/2740; else if(code==='XAG') rateCode = 1/32.50; else rateCode = 1; 
    } 
    return (1 / rateCode) * state.rates[state.baseCurrency]; 
}

async function detectLocationCurrency() {
    if (localStorage.getItem('user_currency_set')) { state.baseCurrency = localStorage.getItem('baseCurr'); return; }
    try { const geoRes = await fetch('https://ipapi.co/json/'); const geoData = await geoRes.json(); const userCurrency = geoData.currency; if (userCurrency && (state.rates[userCurrency] || userCurrency === 'PLN' || userCurrency === 'TRY')) { state.baseCurrency = userCurrency; localStorage.setItem('baseCurr', userCurrency); if (!state.favs.includes(userCurrency)) { state.favs.push(userCurrency); localStorage.setItem('favs_v9', JSON.stringify(state.favs)); } localStorage.setItem('user_currency_set', 'true'); } } catch (err) { }
}

// --- UI GÜNCELLEME (SAĞLAM GRID) ---
function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); }

function renderGrid() {
    const container = document.getElementById('dashboard-grid');
    if(!container) return;
    const sym = getSymbol(state.baseCurrency);
    
    if(state.rates['XAU'] && !state.favs.includes('XAU')) state.favs.push('XAU');

    const validFavs = state.favs.filter(curr => {
        if (curr === state.baseCurrency) return false;
        if (!state.rates[curr] && curr !== 'XAU' && curr !== 'XAG') return false;
        return true;
    });

    container.innerHTML = validFavs.map(curr => {
        const val = getPrice(curr);
        if (!val || isNaN(val)) return '';

        const flagUrl = getFlagUrl(curr);
        let imgTag = '';
        if (curr === 'XAU') imgTag = `<div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50"><i data-lucide="coins" size="20"></i></div>`; 
        else if (curr === 'XAG') imgTag = `<div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700"><i data-lucide="disc" size="20"></i></div>`; 
        else if (flagUrl) imgTag = `<img src="${flagUrl}" class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 shadow-md object-cover">`; 
        else imgTag = `<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200">${curr.substring(0,2)}</div>`; 
        
        const change = (Math.random() * 1.5 - 0.5).toFixed(2);
        const colorClass = change >= 0 ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20';
        const arrow = change >= 0 ? 'move-up-right' : 'move-down-right';

        return `<div onclick="openChartModal('${curr}')" class="relative cursor-pointer bg-white dark:bg-cardDark p-4 rounded-2xl neon-box card-pop flex flex-col justify-between h-[140px] shadow-sm active:scale-95 transition group border border-slate-100 dark:border-white/5"><div class="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-lg ${colorClass} flex items-center gap-1">${change > 0 ? '+' : ''}${change}% <i data-lucide="${arrow}" size="12"></i></div><div class="mb-2">${imgTag}</div><div><p class="font-bold text-slate-400 text-xs uppercase tracking-wide">${curr} / ${state.baseCurrency}</p><p class="font-bold text-xl text-slate-800 dark:text-white mt-1 font-mono">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:3})}</p></div></div>`; 
    }).join(''); 
    
    if(window.lucide) lucide.createIcons(); 
}

function renderCryptoGrid() { 
    const container = document.getElementById('crypto-grid'); if(!container) return; const sym = getSymbol(state.baseCurrency); 
    container.innerHTML = state.cryptoFavs.map(c => { const val = getPrice(c); const icon = CRYPTO_ICONS[c] || 'btc'; return `<div onclick="openChartModal('${c}')" class="cursor-pointer bg-white dark:bg-cardDark p-5 rounded-[1.5rem] neon-box card-pop flex items-center justify-between gap-2 shadow-sm active:scale-95 transition"><div class="flex items-center gap-3 flex-1 min-w-0"><img src="https://assets.coincap.io/assets/icons/${icon}@2x.png" class="w-10 h-10 rounded-full shadow-lg flex-shrink-0 bg-white object-cover" onerror="this.src='https://assets.coincap.io/assets/icons/btc@2x.png'"><div class="min-w-0"><span class="font-bold text-lg text-slate-800 dark:text-white block truncate">${c}</span><span class="text-xs text-slate-400 block truncate">Coin</span></div></div><div class="text-right flex-shrink-0"><p class="font-bold text-base text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><p class="text-[10px] text-green-500 font-medium">+1.2%</p></div></div>`; }).join(''); 
}

// --- DİĞER YARDIMCILAR (Portföy, Çevirici, Grafik) ---
// (Bu fonksiyonlar aynı kalıyor, sadece I18N entegrasyonu tamam)
function updateBaseCurrencyUI() { document.querySelectorAll('.base-curr-text').forEach(el => el.innerText = state.baseCurrency); document.querySelectorAll('.base-curr-symbol').forEach(el => el.innerText = getSymbol(state.baseCurrency)); document.getElementById('settings-code').innerText = state.baseCurrency; const flagUrl = getFlagUrl(state.baseCurrency); const imgEl = document.getElementById('settings-flag'); const iconEl = document.getElementById('settings-globe-icon'); if (flagUrl) { imgEl.src = flagUrl; imgEl.style.display = 'block'; iconEl.classList.add('hidden'); } else { imgEl.style.display = 'none'; iconEl.classList.remove('hidden'); if(window.lucide) lucide.createIcons(); } }
function renderPortfolio() { const list = document.getElementById('portfolio-list'); const totalEl = document.getElementById('portfolio-total'); let totalVal = 0; const sym = getSymbol(state.baseCurrency); if(state.portfolio.length === 0) { list.innerHTML = `<div class="text-center p-10 text-slate-400"><i data-lucide="wallet" size="48" class="mx-auto mb-3 opacity-20"></i><p class="text-sm opacity-50">Empty / Boş</p></div>`; totalEl.innerText = "0.00"; } else { list.innerHTML = state.portfolio.map((item, index) => { const price = getPrice(item.symbol); const val = price * item.amount; totalVal += val; return `<div class="bg-white dark:bg-cardDark p-4 rounded-xl flex justify-between items-center shadow-sm border border-slate-100 dark:border-white/5"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">${item.symbol}</div><div><p class="font-bold text-slate-800 dark:text-white">${item.symbol}</p><p class="text-xs text-slate-400">${item.amount}</p></div></div><div class="text-right"><p class="font-bold text-slate-800 dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p><button onclick="state.portfolio.splice(${index}, 1); localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); renderPortfolio();" class="text-red-400 text-xs mt-1">X</button></div></div>`; }).join(''); totalEl.innerText = totalVal.toLocaleString(undefined, {maximumFractionDigits:2}); } if(window.lucide) lucide.createIcons(); }
function clearPortfolio() { state.portfolio = []; localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); renderPortfolio(); }
function updateConverterUI() { document.getElementById('code-from').innerText = state.convFrom; document.getElementById('code-to').innerText = state.convTo; const f1 = document.getElementById('flag-from'); const f2 = document.getElementById('flag-to'); const u1 = getFlagUrl(state.convFrom); const u2 = getFlagUrl(state.convTo); if(u1) { f1.src = u1; f1.style.display='block'; } else f1.style.display='none'; if(u2) { f2.src = u2; f2.style.display='block'; } else f2.style.display='none'; }
function convert() { const inputVal = document.getElementById('conv-amount').value; if(inputVal === '') { document.getElementById('conv-result').innerText = "---"; return; } const amt = parseFloat(inputVal) || 0; const rate = state.rates[state.convTo] / state.rates[state.convFrom]; const res = amt * rate; document.getElementById('conv-result').innerText = `${res.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})} ${state.convTo}`; }
function swapCurrencies() { [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; updateConverterUI(); convert(); }
function nav(page) { document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active')); document.getElementById('page-' + page).classList.add('active'); document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('text-[var(--theme-color)]', 'active'); b.classList.add('text-slate-400'); b.style.color = ''; }); const btn = document.getElementById('nav-' + page); if(btn) { btn.classList.add('text-[var(--theme-color)]', 'active'); btn.classList.remove('text-slate-400'); btn.style.color = state.theme; } if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const sb = document.getElementById('sidebar'); const isOpen = sb.style.transform === 'translateX(0px)'; sb.style.transform = isOpen ? 'translateX(-100%)' : 'translateX(0px)'; document.getElementById('overlay').classList.toggle('hidden', isOpen); }
function getSymbol(curr) { const symbols = {'PLN':'zł', 'USD':'$', 'EUR':'€', 'TRY':'₺', 'GBP':'£'}; return symbols[curr] || curr; }
function getFlagUrl(code) { return FLAG_MAP[code] ? `https://flagcdn.com/w80/${FLAG_MAP[code]}.png` : null; }
function toggleVSMode() { if(state.vsPair) { state.vsPair = null; document.getElementById('vs-btn').classList.remove('bg-indigo-600', 'text-white'); } else { state.vsPair = 'BTC'; document.getElementById('vs-btn').classList.add('bg-indigo-600', 'text-white'); } initChart('mainChart', state.theme); startLiveSimulations(); }
function swapChart() { state.isChartSwapped = !state.isChartSwapped; startLiveSimulations(); }
function initChart(id, color) { const canvas = document.getElementById(id); if(!canvas) return; if(charts[id]) charts[id].destroy(); const ctx = canvas.getContext('2d'); let datasets = [{ label: id==='mainChart'?state.chartPair:state.cryptoChartPair, data: Array(20).fill(null), borderColor: color, borderWidth: 3, backgroundColor: createGradient(ctx, color), fill: true, tension: 0.4, pointRadius: 0 }]; if(id==='mainChart' && state.vsPair) { datasets.push({ label: state.vsPair, data: Array(20).fill(null), borderColor: '#facc15', borderWidth: 3, borderDash: [5,5], fill: false, tension: 0.4, pointRadius: 0 }); } charts[id] = new Chart(ctx, { type: 'line', data: { labels: Array(20).fill(''), datasets: datasets }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } }, animation: { duration: 0 } } }); }
function createGradient(ctx, color) { const g = ctx.createLinearGradient(0, 0, 0, 300); g.addColorStop(0, color + '55'); g.addColorStop(1, color + '00'); return g; }
function startLiveSimulations() { if(intervals['main']) clearInterval(intervals['main']); if(intervals['crypto']) clearInterval(intervals['crypto']); const mainChart = charts['mainChart']; if(mainChart) { let val1 = getPrice(state.chartPair); if(state.isChartSwapped) val1 = 1/val1; mainChart.data.datasets[0].data = Array(20).fill(val1).map(v => v * (1+(Math.random()-0.5)*0.01)); intervals['main'] = setInterval(() => { const arr1 = mainChart.data.datasets[0].data; const next1 = arr1[arr1.length-1] * (1 + (Math.random()-0.5)*0.005); arr1.shift(); arr1.push(next1); if(state.vsPair) { const arr2 = mainChart.data.datasets[1].data; const next2 = arr2[arr2.length-1] * (1 + (Math.random()-0.5)*0.01); arr2.shift(); arr2.push(next2); } mainChart.update(); const sym = state.isChartSwapped ? state.chartPair : getSymbol(state.baseCurrency); document.getElementById('chart-price').innerText = `${sym} ${next1.toLocaleString(undefined, {maximumFractionDigits:4})}`; if(state.isChartSwapped) { document.getElementById('chart-symbol').innerHTML = `<span class="base-curr-text">${state.baseCurrency}</span>/${state.chartPair}`; } else { document.getElementById('chart-symbol').innerHTML = `${state.chartPair}/<span class="base-curr-text">${state.baseCurrency}</span>`; } }, 1000); } const cChart = charts['cryptoChart']; if(cChart) { const cVal = getPrice(state.cryptoChartPair); cChart.data.datasets[0].data = Array(20).fill(cVal).map(v => v * (1+(Math.random()-0.5)*0.01)); intervals['crypto'] = setInterval(() => { const arr = cChart.data.datasets[0].data; const next = arr[arr.length-1] * (1 + (Math.random()-0.5)*0.01); arr.shift(); arr.push(next); cChart.update(); const sym = getSymbol(state.baseCurrency); document.getElementById('crypto-chart-price').innerText = `${sym} ${next.toLocaleString(undefined, {maximumFractionDigits:2})}`; }, 1000); } }
function openSelector(mode) { state.drawerMode = mode; document.getElementById('selector-drawer').classList.remove('hidden'); setTimeout(() => document.getElementById('drawer-panel').classList.remove('translate-y-full'), 10); const list = document.getElementById('drawer-list'); let items = []; let activeList = []; if(mode === 'grid') { items = [...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = state.favs; } else if (mode === 'settings') { items = Object.keys(state.rates).sort(); activeList = [state.baseCurrency]; } else if (mode === 'chart-fiat') { items = [...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = [state.chartPair]; } else if (mode === 'crypto' || mode === 'chart-crypto') { items = Object.keys(CRYPTO_ICONS); activeList = mode==='chart-crypto' ? [state.cryptoChartPair] : state.cryptoFavs; } else if (mode === 'add-asset') { items = [...Object.keys(CRYPTO_ICONS), ...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = []; } else if (mode === 'from' || mode === 'to') { items = Object.keys(state.rates).sort(); activeList = [state.convFrom, state.convTo]; } renderDrawerList(items, activeList, mode === 'settings' || mode.includes('chart') || mode === 'add-asset' || mode === 'from' || mode === 'to'); }
function renderDrawerList(items, activeList, isSingleSelect) { document.getElementById('drawer-list').innerHTML = items.map(c => { const isSel = activeList.includes(c); let img = ''; let name = CURRENCY_NAMES[c] || c; if(CRYPTO_ICONS[c]) img = `<img src="https://assets.coincap.io/assets/icons/${CRYPTO_ICONS[c]}@2x.png" class="w-8 h-8 rounded-full object-cover bg-white">`; else if (c === 'XAU') img = `<div class="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white"><i data-lucide="coins" size="14"></i></div>`; else if (c === 'XAG') img = `<div class="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white"><i data-lucide="disc" size="14"></i></div>`; else { const flagUrl = getFlagUrl(c); img = flagUrl ? `<img src="${flagUrl}" class="w-8 h-8 rounded-full shadow-sm border border-slate-100 object-cover">` : `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><i data-lucide="globe" size="16" class="text-slate-400"></i></div>`; } let icon = ''; if (isSingleSelect && state.drawerMode !== 'add-asset') { icon = isSel ? `<i data-lucide="circle-dot" class="text-[${state.theme}]"></i>` : '<i data-lucide="circle" class="text-slate-300"></i>'; } else if (isSel) { icon = `<i data-lucide="check-circle" class="text-[${state.theme}] fill-indigo-100"></i>`; } return `<button onclick="handleSelection('${c}')" class="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl border-b border-gray-50 dark:border-white/5">${isSingleSelect && state.drawerMode!=='add-asset' ? icon : ''} ${img}<div class="flex-1 text-left"> <span class="font-bold text-lg text-slate-800 dark:text-white block">${c}</span> <span class="text-xs text-slate-400 font-medium">${name}</span> </div>${!isSingleSelect ? icon : ''}</button>`; }).join(''); if(window.lucide) lucide.createIcons(); }
function handleSelection(code) { const mode = state.drawerMode; if(mode === 'settings') { state.baseCurrency = code; localStorage.setItem('baseCurr', code); updateUI(); startLiveSimulations(); closeAllDrawers(); } else if(mode === 'chart-fiat') { state.chartPair = code; startLiveSimulations(); closeAllDrawers(); } else if(mode === 'chart-crypto') { state.cryptoChartPair = code; startLiveSimulations(); closeAllDrawers(); } else if(mode === 'from') { state.convFrom = code; updateConverterUI(); convert(); closeAllDrawers(); } else if(mode === 'to') { state.convTo = code; updateConverterUI(); convert(); closeAllDrawers(); } else if(mode === 'add-asset') { state.tempAsset = code; closeAllDrawers(); document.getElementById('qty-title').innerText = `${code} ${I18N[state.lang].quantity_title}`; document.getElementById('quantity-modal').classList.remove('hidden'); document.getElementById('asset-amount').focus(); } else { const listName = mode === 'grid' ? 'favs' : 'cryptoFavs'; const storageName = mode === 'grid' ? 'favs_v9' : 'crypto_v8'; if(state[listName].includes(code)) state[listName] = state[listName].filter(x => x !== code); else state[listName].push(code); localStorage.setItem(storageName, JSON.stringify(state[listName])); updateUI(); openSelector(mode); } }
function closeAllDrawers() { document.getElementById('drawer-panel').classList.add('translate-y-full'); setTimeout(() => document.getElementById('selector-drawer').classList.add('hidden'), 300); }
function filterDrawer() { const query = document.getElementById('search-input').value.toLowerCase(); const btns = document.getElementById('drawer-list').getElementsByTagName('button'); for(let btn of btns) { btn.style.display = btn.innerText.toLowerCase().includes(query) ? 'flex' : 'none'; } }
function openAddAssetSelector() { state.tempAsset = null; openSelector('add-asset'); }
function confirmAddAsset() { const amtInput = document.getElementById('asset-amount'); const amt = parseFloat(amtInput.value); if(state.tempAsset && amt > 0) { const existing = state.portfolio.find(p => p.symbol === state.tempAsset); if(existing) { existing.amount += amt; } else { state.portfolio.push({symbol: state.tempAsset, amount: amt}); } localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); document.getElementById('quantity-modal').classList.add('hidden'); renderPortfolio(); amtInput.value = ''; } else { alert("Lütfen geçerli bir miktar girin."); } }
function openChartModal(symbol) { let modal = document.getElementById('tv-modal'); if(modal) modal.remove(); modal = document.createElement('div'); modal.id = 'tv-modal'; modal.className = 'fixed inset-0 z-[50] bg-black flex flex-col'; modal.innerHTML = `<div class="flex justify-between items-center p-4 border-b border-gray-800 bg-[#131722] relative z-[60]"><h3 id="tv-title" class="text-white font-bold text-lg">${symbol} / USD</h3><button onclick="document.getElementById('tv-modal').remove()" class="text-gray-400 hover:text-white p-2 cursor-pointer"><i data-lucide="x" size="24"></i></button></div><div id="tv-chart-container" class="flex-1 w-full h-full bg-black relative z-0 pb-20"></div><div class="fixed bottom-0 left-0 w-full p-4 bg-[#131722]/95 border-t border-gray-800 z-[100] flex justify-center backdrop-blur-md"><button onclick="openProAIChat('${symbol}')" class="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer"><i data-lucide="sparkles"></i> Grafer Pro Ai</button></div>`; document.body.appendChild(modal); if(window.lucide) lucide.createIcons(); let tvSymbol = symbol==='USD'?"FX:EURUSD":symbol==='EUR'?"FX:EURUSD":symbol==='TRY'?"FX:USDTRY":symbol==='GBP'?"FX:GBPUSD":symbol==='XAU'?"OANDA:XAUUSD":symbol==='BTC'?"BINANCE:BTCUSDT":`FX:USD${symbol}`; if(window.TradingView) new TradingView.widget({ "autosize": true, "symbol": tvSymbol, "interval": "D", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "hide_side_toolbar": false, "allow_symbol_change": true, "container_id": "tv-chart-container" }); }
function openProAIChat(symbol) { const price = getPrice(symbol).toFixed(4); const modal = document.getElementById('ai-modal'); if(modal) { modal.classList.remove('hidden'); const content = document.getElementById('ai-content'); content.innerHTML = ''; addProMessage(`Grafer Pro AI: ${symbol} analiz ediliyor...`, 'bot', true); askOpenAI(`${symbol} (Price: ${price}) technical analysis.`, true); } }
function addProMessage(text, sender, isLoading = false) { const container = document.getElementById('ai-content'); const div = document.createElement('div'); div.className = `p-2 ${isLoading ? 'animate-pulse text-indigo-500' : ''}`; div.innerText = text; container.appendChild(div); }
async function askOpenAI(message, isInitial) { try { const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message }) }); const data = await res.json(); if(isInitial) document.getElementById('ai-content').innerHTML = ''; addProMessage(data.reply, 'bot'); } catch (e) { addProMessage("Connection Error.", 'bot'); } }
