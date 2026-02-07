// --- VERSİYON (V3.0 - KÖR NİŞANCI) ---
const APP_VERSION = '3.0'; 

// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

// --- DİL SÖZLÜĞÜ (HER KELİME İÇİN) ---
const I18N = {
    tr: { amount: "MİKTAR", source: "KAYNAK", target: "HEDEF", result: "SONUÇ", reset: "SIFIRLA", enter_amount: "Miktar...", analyzing: "Analiz...", close: "Kapat", live: "CANLI KUR" },
    en: { amount: "AMOUNT", source: "SOURCE", target: "TARGET", result: "RESULT", reset: "RESET", enter_amount: "Amount...", analyzing: "Analyzing...", close: "Close", live: "LIVE RATE" },
    pl: { amount: "ILOŚĆ", source: "ŹRÓDŁO", target: "CEL", result: "WYNIK", reset: "RESETUJ", enter_amount: "Kwota...", analyzing: "Analizowanie...", close: "Zamknij", live: "KURS" },
    ru: { amount: "СУММА", source: "ИСТОЧНИК", target: "ЦЕЛЬ", result: "РЕЗУЛЬТАТ", reset: "СБРОС", enter_amount: "Сумма...", analyzing: "Анализ...", close: "Закрыть", live: "КУРС" },
    ka: { amount: "თანხა", source: "წყარო", target: "მიზანი", result: "შედეგი", reset: "განულება", enter_amount: "თანხა...", analyzing: "ანალიზი...", close: "დახურვა", live: "კურსი" }
};

const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Altın fiyatları rekor tazeledi.", "Merkez Bankası faiz kararını açıkladı.", "Teknoloji hisselerinde ralli var."],
    en: ["Bitcoin approaching 100K target.", "Gold prices hit new record.", "Central Bank announces rate decision.", "Tech stocks rallying today."],
    pl: ["Bitcoin zbliża się do poziomu 100 tys.", "Ceny złota biją nowe rekordy.", "Bank Centralny ogłasza decyzję ws. stóp.", "Akcje technologiczne rosną."],
    ka: ["ბიტკოინი 100 ათასს უახლოვდება.", "ოქროს ფასმა რეკორდი მოხსნა.", "ცენტრალურმა ბანკმა განაკვეთი გამოაცხადა.", "ტექნოლოგიური აქციები იზრდება."],
    ru: ["Биткойн приближается к 100К.", "Цены на золото побили рекорд.", "Центробанк объявил ставку.", "Технологические акции растут."]
};

// --- STATE ---
let state = {
    rates: {}, baseCurrency: 'USD', chartPair: 'USD', 
    lang: 'en', theme: localStorage.getItem('theme') || '#4f46e5',
    favs: JSON.parse(localStorage.getItem('favs_v9')) || ['XAU', 'XAG', 'USD', 'EUR', 'GBP'],
    cryptoFavs: JSON.parse(localStorage.getItem('crypto_v8')) || ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    drawerMode: '', neonEnabled: localStorage.getItem('neonEnabled') !== 'false', tempAsset: null, convFrom: 'USD', convTo: 'PLN', cryptoChartPair: 'BTC'
};

window.onload = async () => {
    // 0. Cache Temizliği
    if (localStorage.getItem('app_version') !== APP_VERSION) {
        localStorage.clear(); localStorage.setItem('app_version', APP_VERSION); location.reload(); return;
    }

    lucide.createIcons();

    // 1. DİL AYARI
    if (!localStorage.getItem('lang')) {
        const phoneLang = navigator.language.slice(0, 2); 
        const supported = ['tr', 'en', 'pl', 'ru', 'ka'];
        state.lang = supported.includes(phoneLang) ? phoneLang : 'en';
        localStorage.setItem('lang', state.lang);
    } else { state.lang = localStorage.getItem('lang'); }
    
    // 2. VERİLERİ ÇEK
    await fetchData(); 
    await detectLocationCurrency(); 

    // 3. ARAYÜZÜ BAŞLAT
    setLanguage(state.lang);
    setTheme(state.theme);
    updateUI(); 
    startNewsTicker();

    // --- ÖZEL "KESKİN NİŞANCI" FONKSİYONLARI ---
    // Her 500ms'de bir sayfayı tara ve hataları düzelt
    setInterval(() => {
        destroyPhantomButtons(); // Analiza AI butonunu sil
        forceTranslateLabels();  // MİKTAR yazısını zorla çevir
        fixBigZero();            // O koca 0'ı sil
        fillEmptyBox();          // Boş kutuyu doldur
    }, 500);

    // TradingView Script
    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);
};

// --- 1. GÖREV: HAYALET BUTONU YOK ET ---
function destroyPhantomButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        const text = btn.innerText.toLowerCase();
        // Eğer içinde 'analiz' veya 'ai' geçiyorsa ve tıklama özelliği yoksa SİL
        if ((text.includes('analiz') || text.includes('ai')) && !btn.onclick) {
            btn.style.display = 'none';
            btn.remove(); // HTML'den tamamen sök
        }
    });
}

// --- 2. GÖREV: YAZILARI ZORLA ÇEVİR (ID'ye bakmadan) ---
function forceTranslateLabels() {
    // Sayfadaki tüm küçük başlıkları bul (label, span, p)
    const elements = document.querySelectorAll('label, span, p, h3, h4, div');
    const dict = I18N[state.lang];

    // Bu kelimeleri görürsen affetme, hemen çevir
    const targets = {
        'MİKTAR': dict.amount, 'AMOUNT': dict.amount, 'ILOŚĆ': dict.amount, 'СУММА': dict.amount, 'თანხა': dict.amount,
        'KAYNAK': dict.source, 'SOURCE': dict.source, 'ŹRÓDŁO': dict.source, 'ИСТОЧНИК': dict.source, 'წყარო': dict.source,
        'HEDEF': dict.target, 'TARGET': dict.target, 'CEL': dict.target, 'ЦЕЛЬ': dict.target, 'მიზანი': dict.target,
        'SONUÇ': dict.result, 'RESULT': dict.result, 'WYNIK': dict.result, 'РЕЗУЛЬТАТ': dict.result, 'შედეგი': dict.result,
        'SIFIRLA': dict.reset, 'RESET': dict.reset, 'RESETUJ': dict.reset, 'СБРОС': dict.reset, 'განულება': dict.reset
    };

    elements.forEach(el => {
        // Sadece tek kelimelik veya kısa metinleri kontrol et (performans için)
        if(el.innerText && el.innerText.length < 20) {
            const txt = el.innerText.trim().toUpperCase();
            if(targets[txt] && el.innerText !== targets[txt]) {
                el.innerText = targets[txt];
            }
        }
    });
    
    // Butonları ayrıca kontrol et
    document.querySelectorAll('button').forEach(btn => {
        if(btn.innerText === 'SIFIRLA' || btn.innerText === 'RESET' || btn.innerText === 'RESETUJ') {
            btn.innerText = dict.reset;
            btn.onclick = fixBigZero; // Tıklayınca 0'ı temizle
        }
    });
}

// --- 3. GÖREV: O KOCA "0" RAKAMINI SİL ---
function fixBigZero() {
    const input = document.getElementById('conv-amount');
    if (input) {
        if(input.value === '0') input.value = ''; // 0 ise sil
        input.placeholder = I18N[state.lang].enter_amount;
    }
    // Sonuç kısmındaki "0,00" yazısını da temizle (Eğer işlem yapılmadıysa)
    const resultDivs = document.querySelectorAll('div');
    resultDivs.forEach(div => {
        if(div.innerText.includes('SONUÇ') || div.innerText.includes('RESULT') || div.innerText.includes('WYNIK')) {
            // Sonuç başlığının altındaki sayıyı bulmaya çalış
            const nextEl = div.nextElementSibling;
            if(nextEl && (nextEl.innerText === '0' || nextEl.innerText.includes('0,00'))) {
                nextEl.innerText = '---';
            }
        }
    });
}

// --- 4. GÖREV: BOŞ KUTUYU DOLDUR ---
function fillEmptyBox() {
    // Ana sayfadaki o boş beyaz alanı bulmak için strateji:
    // İçinde ne grafik var ne yazı, ama yüksekliği var.
    const divs = document.querySelectorAll('div');
    let targetBox = null;

    // "Analiza AI" butonunun olduğu (veya olduğu yerin) ebeveynini bul
    // Ya da en üstteki büyük kartı bul
    
    // ID'si chart-container ise
    const idBox = document.getElementById('chart-container');
    if(idBox) targetBox = idBox;
    
    if (!targetBox) return; // Bulamazsa zorlama

    // Eğer kutunun içi boşsa veya eski grafik varsa doldur
    if(targetBox.innerHTML.trim() === '' || targetBox.innerHTML.includes('canvas')) {
        const local = state.baseCurrency;
        const ref = local === 'USD' ? 'EUR' : 'USD';
        const val = state.rates[local] / state.rates[ref];

        targetBox.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-cardDark rounded-2xl p-4 relative overflow-hidden">
                <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
                <h3 class="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">${I18N[state.lang].live}</h3>
                <div class="flex items-end gap-2">
                    <span class="text-5xl font-black text-slate-800 dark:text-white">${val.toFixed(2)}</span>
                    <span class="text-xl font-bold text-indigo-500 mb-2">${local}</span>
                </div>
                <p class="text-slate-400 text-sm font-medium mt-1">1 ${ref} = ${val.toFixed(4)} ${local}</p>
                <div class="mt-3 flex gap-2">
                     <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md animate-pulse">● LIVE</span>
                     <span class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">${state.lang.toUpperCase()}</span>
                </div>
            </div>
        `;
    }
}

// --- STANDART FONKSİYONLAR (Bunlar sistemi ayakta tutar) ---
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

function setLanguage(lang) {
    state.lang = lang; localStorage.setItem('lang', lang);
    document.getElementById('lang-dropdown').classList.add('hidden'); document.getElementById('lang-dropdown').classList.remove('flex');
    const langBtn = document.getElementById('lang-dropdown')?.previousElementSibling; 
    if(langBtn) langBtn.innerHTML = `<i data-lucide="globe" class="inline-block mr-1"></i> ${state.lang.toUpperCase()}`;
    startNewsTicker();
    forceTranslateLabels(); // Anında çevir
    fillEmptyBox(); // Kartı güncelle
    lucide.createIcons();
}

function startNewsTicker() { const container = document.getElementById('news-ticker'); const msgs = NEWS_DATA[state.lang] || NEWS_DATA['en']; container.innerHTML = msgs.map(m => { const query = encodeURIComponent(m); return `<a href="https://www.google.com/search?q=${query}&tbm=nws" target="_blank" class="ticker-item cursor-pointer hover:text-indigo-400 transition" style="text-decoration:none;"><span style="color:var(--theme-color)">●</span> ${m}</a>`; }).join(''); }
function getSymbol(curr) { const symbols = {'PLN':'zł', 'USD':'$', 'EUR':'€', 'TRY':'₺', 'GBP':'£', 'GEL':'₾'}; return symbols[curr] || curr; }
function setTheme(color) { state.theme = color; localStorage.setItem('theme', color); document.documentElement.style.setProperty('--theme-color', color); document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active')); }
function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); forceTranslateLabels(); }
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
function openSelector(mode) { state.drawerMode = mode; document.getElementById('selector-drawer').classList.remove('hidden'); setTimeout(() => document.getElementById('drawer-panel').classList.remove('translate-y-full'), 10); const list = document.getElementById('drawer-list'); let items = []; let activeList = []; if(mode === 'grid') { items = [...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = state.favs; } else if (mode === 'settings') { items = Object.keys(state.rates).sort(); activeList = [state.baseCurrency]; } else if (mode === 'chart-fiat') { items = [...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = [state.chartPair]; } else if (mode === 'crypto' || mode === 'chart-crypto') { items = Object.keys(CRYPTO_ICONS); activeList = mode==='chart-crypto' ? [state.cryptoChartPair] : state.cryptoFavs; } else if (mode === 'add-asset') { items = [...Object.keys(CRYPTO_ICONS), ...Object.keys(FLAG_MAP), 'XAU', 'XAG']; activeList = []; } else if (mode === 'from' || mode === 'to') { items = Object.keys(state.rates).sort(); activeList = [state.convFrom, state.convTo]; } renderDrawerList(items, activeList, mode === 'settings' || mode.includes('chart') || mode === 'add-asset' || mode === 'from' || mode === 'to'); }
function renderDrawerList(items, activeList, isSingleSelect) { document.getElementById('drawer-list').innerHTML = items.map(c => { const isSel = activeList.includes(c); let img = ''; let name = CURRENCY_NAMES[c] || c; if(CRYPTO_ICONS[c]) img = `<img src="https://assets.coincap.io/assets/icons/${CRYPTO_ICONS[c]}@2x.png" class="w-8 h-8 rounded-full object-cover bg-white">`; else if (c === 'XAU') img = `<div class="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white"><i data-lucide="coins" size="14"></i></div>`; else if (c === 'XAG') img = `<div class="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white"><i data-lucide="disc" size="14"></i></div>`; else { const flagUrl = getFlagUrl(c); img = flagUrl ? `<img src="${flagUrl}" class="w-8 h-8 rounded-full shadow-sm border border-slate-100 object-cover">` : `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><i data-lucide="globe" size="16" class="text-slate-400"></i></div>`; } let icon = ''; if (isSingleSelect && state.drawerMode !== 'add-asset') { icon = isSel ? `<i data-lucide="circle-dot" class="text-[${state.theme}]"></i>` : '<i data-lucide="circle" class="text-slate-300"></i>'; } else if (isSel) { icon = `<i data-lucide="check-circle" class="text-[${state.theme}] fill-indigo-100"></i>`; } return `<button onclick="handleSelection('${c}')" class="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl border-b border-gray-50 dark:border-white/5">${isSingleSelect && state.drawerMode!=='add-asset' ? icon : ''} ${img}<div class="flex-1 text-left"> <span class="font-bold text-lg text-slate-800 dark:text-white block">${c}</span> <span class="text-xs text-slate-400 font-medium">${name}</span> </div>${!isSingleSelect ? icon : ''}</button>`; }).join(''); lucide.createIcons(); }
function handleSelection(code) { const mode = state.drawerMode; if(mode === 'settings') { state.baseCurrency = code; localStorage.setItem('baseCurr', code); updateUI(); closeAllDrawers(); } else if(mode === 'chart-fiat') { state.chartPair = code; closeAllDrawers(); } else if(mode === 'chart-crypto') { state.cryptoChartPair = code; closeAllDrawers(); } else if(mode === 'from') { state.convFrom = code; updateConverterUI(); convert(); closeAllDrawers(); } else if(mode === 'to') { state.convTo = code; updateConverterUI(); convert(); closeAllDrawers(); } else if(mode === 'add-asset') { state.tempAsset = code; closeAllDrawers(); document.getElementById('qty-title').innerText = `${code} Miktarı`; document.getElementById('quantity-modal').classList.remove('hidden'); document.getElementById('asset-amount').focus(); } else { const listName = mode === 'grid' ? 'favs' : 'cryptoFavs'; const storageName = mode === 'grid' ? 'favs_v9' : 'crypto_v8'; if(state[listName].includes(code)) state[listName] = state[listName].filter(x => x !== code); else state[listName].push(code); localStorage.setItem(storageName, JSON.stringify(state[listName])); updateUI(); openSelector(mode); } }
function closeAllDrawers() { document.getElementById('drawer-panel').classList.add('translate-y-full'); setTimeout(() => document.getElementById('selector-drawer').classList.add('hidden'), 300); }
function filterDrawer() { const query = document.getElementById('search-input').value.toLowerCase(); const btns = document.getElementById('drawer-list').getElementsByTagName('button'); for(let btn of btns) { btn.style.display = btn.innerText.toLowerCase().includes(query) ? 'flex' : 'none'; } }
function openAddAssetSelector() { state.tempAsset = null; openSelector('add-asset'); }
function confirmAddAsset() { const amtInput = document.getElementById('asset-amount'); const amt = parseFloat(amtInput.value); if(state.tempAsset && amt > 0) { const existing = state.portfolio.find(p => p.symbol === state.tempAsset); if(existing) { existing.amount += amt; } else { state.portfolio.push({symbol: state.tempAsset, amount: amt}); } localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); document.getElementById('quantity-modal').classList.add('hidden'); renderPortfolio(); amtInput.value = ''; } else { alert("Lütfen geçerli bir miktar girin."); } }
function clearPortfolio() { state.portfolio = []; localStorage.setItem('portfolio', JSON.stringify(state.portfolio)); renderPortfolio(); }
function openChartModal(symbol) { let modal = document.getElementById('tv-modal'); if(modal) modal.remove(); modal = document.createElement('div'); modal.id = 'tv-modal'; modal.className = 'fixed inset-0 z-[50] bg-black flex flex-col'; modal.innerHTML = ` <div class="flex justify-between items-center p-4 border-b border-gray-800 bg-[#131722] relative z-[60]"> <h3 id="tv-title" class="text-white font-bold text-lg">${symbol} / USD</h3> <button onclick="document.getElementById('tv-modal').remove()" class="text-gray-400 hover:text-white p-2 cursor-pointer"><i data-lucide="x" size="24"></i></button> </div> <div id="tv-chart-container" class="flex-1 w-full h-full bg-black relative z-0 pb-20"></div> <div class="fixed bottom-0 left-0 w-full p-4 bg-[#131722]/95 border-t border-gray-800 z-[100] flex justify-center backdrop-blur-md"> <button onclick="openProAIChat('${symbol}')" class="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 cursor-pointer"> <i data-lucide="sparkles"></i> Grafer Pro Ai </button> </div>`; document.body.appendChild(modal); lucide.createIcons(); let tvSymbol = symbol === 'USD' ? "FX:EURUSD" : (symbol === 'XAU' ? "OANDA:XAUUSD" : (symbol === 'BTC' ? "BINANCE:BTCUSDT" : `FX:USD${symbol}`)); if(window.TradingView) new TradingView.widget({ "autosize": true, "symbol": tvSymbol, "interval": "D", "timezone": "Etc/UTC", "theme": "dark", "style": "1", "locale": "en", "toolbar_bg": "#f1f3f6", "enable_publishing": false, "container_id": "tv-chart-container" }); }
