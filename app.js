// --- VERSİYON VE AYARLAR ---
const APP_VERSION = '5.0'; 

// --- VERİ TABANI ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dolar', 'EUR':'Euro', 'GBP':'Sterlin', 'TRY':'Türk Lirası', 'PLN':'Zloti', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Altın', 'XAG':'Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

// --- DİL SÖZLÜĞÜ (HTML'deki Eksikleri Kapatır) ---
const I18N = {
    tr: { amount: "MİKTAR", source: "KAYNAK", target: "HEDEF", result: "SONUÇ", reset: "SIFIRLA", live: "CANLI KUR", enter: "Miktar..." },
    en: { amount: "AMOUNT", source: "SOURCE", target: "TARGET", result: "RESULT", reset: "RESET", live: "LIVE RATE", enter: "Amount..." },
    pl: { amount: "ILOŚĆ", source: "ŹRÓDŁO", target: "CEL", result: "WYNIK", reset: "RESETUJ", live: "KURS", enter: "Kwota..." },
    ru: { amount: "СУММА", source: "ИСТОЧНИК", target: "ЦЕЛЬ", result: "РЕЗУЛЬТАТ", reset: "СБРОС", live: "КУРС", enter: "Сумма..." },
    ka: { amount: "თანხა", source: "წყარო", target: "მიზანი", result: "შედეგი", reset: "განულება", live: "კურსი", enter: "თანხა..." }
};

// --- HABERLER ---
const NEWS_DATA = {
    tr: ["Bitcoin 100K hedefine ilerliyor.", "Altın fiyatları rekor tazeledi.", "Dolar endeksi kritik seviyede."],
    en: ["Bitcoin approaching 100K target.", "Gold prices hit new record.", "Dollar index at critical level."],
    pl: ["Bitcoin zbliża się do poziomu 100 tys.", "Ceny złota biją nowe rekordy.", "Indeks dolara na krytycznym poziomie."]
};

// --- STATE ---
let state = {
    rates: {}, baseCurrency: 'USD', 
    lang: localStorage.getItem('lang') || 'en', 
    theme: localStorage.getItem('theme') || '#4f46e5',
    favs: JSON.parse(localStorage.getItem('favs_v9')) || ['XAU', 'XAG', 'USD', 'EUR', 'GBP'],
    cryptoFavs: JSON.parse(localStorage.getItem('crypto_v8')) || ['BTC', 'ETH', 'SOL', 'XRP'],
    portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    drawerMode: '', convFrom: 'USD', convTo: 'PLN'
};

// --- BAŞLANGIÇ ---
window.onload = async () => {
    // 1. Verileri Çek
    await fetchData();
    await detectLocationCurrency();
    
    // 2. İkonları Oluştur
    lucide.createIcons();
    
    // 3. Tema Rengini Uygula
    setTheme(state.theme);

    // 4. Ana Sayfadaki "Grafik" Kutusunu "Canlı Kur" Kartına Dönüştür
    transformMainCard();

    // 5. Dil Ayarlarını ve Yazıları Düzelt
    setLanguage(state.lang);
    
    // 6. Çevirici Inputunu Temizle (O "100" yazısını sil)
    const convInput = document.getElementById('conv-amount');
    if(convInput) {
        convInput.value = ''; // Boşalt
        convInput.placeholder = I18N[state.lang].enter;
    }
    
    // 7. Diğer UI Öğelerini Güncelle
    updateUI();
    startNewsTicker();
    
    // Periyodik Kontrol (Hayalet butonlar geri gelmesin diye)
    setInterval(() => {
        transformMainCard(); 
        fixConverterLabels();
    }, 1000);
};

// --- 🛠️ TRANSFORMER: GRAFİK KUTUSUNU CANLI KUR KARTINA ÇEVİR ---
function transformMainCard() {
    // Senin HTML'indeki ID: mainChart olan canvas'ı bul
    const canvas = document.getElementById('mainChart');
    
    if (canvas) {
        // Canvas'ın içinde olduğu ana kutuyu (parent) bul
        // HTML yapına göre: canvas -> div -> div (neon-box olan)
        const container = canvas.parentElement.parentElement;
        
        // Eğer kutu bulunduysa ve içinde hala canvas veya "Analiz" butonu varsa:
        if (container && (container.innerHTML.includes('canvas') || container.innerHTML.includes('Analiz'))) {
            
            // Hesaplamalar
            const local = state.baseCurrency; // PLN (veya konum neyse)
            const target = local === 'USD' ? 'EUR' : 'USD';
            const rate = state.rates[local] / state.rates[target];
            
            // KUTUYU BAŞTAN YARAT (Analiz butonu silinir, grafik silinir)
            container.innerHTML = `
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div class="flex flex-col items-center justify-center h-[220px] text-center z-10">
                    <p class="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase mb-4 animate-pulse">${I18N[state.lang].live}</p>
                    
                    <div class="flex items-end gap-3 mb-2">
                        <span class="text-6xl font-black text-slate-800 dark:text-white tracking-tighter" id="big-rate">${rate.toFixed(2)}</span>
                        <span class="text-2xl font-bold text-indigo-500 mb-2">${local}</span>
                    </div>
                    
                    <div class="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full mt-2">
                        <img src="${getFlagUrl(target)}" class="w-5 h-5 rounded-full">
                        <span class="text-sm font-bold text-slate-500">1 ${target} = ${rate.toFixed(4)} ${local}</span>
                    </div>
                </div>
                <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            `;
        }
    }
}

// --- 🛠️ LABEL FIXER: HTML'DE EKSİK OLAN ÇEVİRİLERİ DÜZELT ---
function fixConverterLabels() {
    // "page-converter" içindeki Label etiketlerini bul
    const labels = document.querySelectorAll('#page-converter label');
    const dict = I18N[state.lang];
    
    // HTML sırasına göre manuel eşleştirme
    if(labels.length >= 3) {
        // 1. Label: Miktar
        if(labels[0].innerText !== dict.amount) labels[0].innerText = dict.amount;
        // 2. Label: Kaynak
        if(labels[1].innerText !== dict.source) labels[1].innerText = dict.source;
        // 3. Label: Hedef
        if(labels[2].innerText !== dict.target) labels[2].innerText = dict.target;
    }
    
    // Sonuç Kutusu Başlığı (SONUÇ)
    const resultBox = document.querySelector('#page-converter .text-indigo-400');
    if(resultBox && resultBox.innerText !== dict.result) {
        resultBox.innerText = dict.result;
    }
    
    // Sıfırla Butonu
    const resetBtn = document.querySelector('#page-converter button.text-slate-400');
    if(resetBtn && resetBtn.innerText !== dict.reset) {
        resetBtn.innerText = dict.reset;
    }
}

// --- API VE VERİ İŞLEMLERİ ---
async function fetchData() { 
    try { 
        const res = await fetch('/api/forex'); const data = await res.json(); 
        state.rates = data.results || {'USD':1, 'EUR':0.92, 'PLN':4.0, 'TRY':34.0};
        try { const g = await fetch('/api/gold'); const gd = await g.json(); state.rates['XAU']=1/gd.XAU; state.rates['XAG']=1/gd.XAG; } catch(e){}
    } catch(e) { state.rates = {'USD':1, 'EUR':0.92, 'PLN':4.0, 'TRY':34.0}; } 
}

async function detectLocationCurrency() {
    if(localStorage.getItem('baseCurr')) { state.baseCurrency = localStorage.getItem('baseCurr'); return; }
    try {
        const res = await fetch('https://ipapi.co/json/'); const data = await res.json();
        if(data.currency && state.rates[data.currency]) { 
            state.baseCurrency = data.currency; 
            localStorage.setItem('baseCurr', data.currency);
            if(!state.favs.includes(data.currency)) state.favs.push(data.currency);
        }
    } catch(e) {}
}

// --- UI GÜNCELLEMELERİ ---
function setLanguage(lang) {
    state.lang = lang; localStorage.setItem('lang', lang);
    
    // 1. data-i18n olanları çevir
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(I18N[lang] && I18N[lang][key]) el.innerText = I18N[lang][key]; // HTML'deki key ile eşleşmeli
    });

    // 2. data-i18n OLMAYANLARI (Miktar, Kaynak vs.) düzelt
    fixConverterLabels();
    
    // 3. Input placeholder
    const inp = document.getElementById('conv-amount');
    if(inp) inp.placeholder = I18N[lang].enter;

    // 4. Kartı yenile (Dili güncellemek için)
    document.getElementById('mainChart') ? null : transformMainCard(); // Eğer canvas yoksa kartı yenile
    
    // Menüyü kapat
    const dd = document.getElementById('lang-dropdown');
    if(dd) { dd.classList.add('hidden'); dd.classList.remove('flex'); }
    
    startNewsTicker();
}

function updateUI() {
    renderGrid();
    renderCryptoGrid();
    renderPortfolio();
    updateConverterUI();
    updateBaseCurrencyUI();
}

// --- ÇEVİRİCİ MANTIĞI ---
function updateConverterUI() {
    const f1 = document.getElementById('flag-from');
    const f2 = document.getElementById('flag-to');
    if(f1) { f1.src = getFlagUrl(state.convFrom); f1.style.display = 'block'; }
    if(f2) { f2.src = getFlagUrl(state.convTo); f2.style.display = 'block'; }
    
    document.getElementById('code-from').innerText = state.convFrom;
    document.getElementById('code-to').innerText = state.convTo;
}

function convert() {
    const inp = document.getElementById('conv-amount');
    const res = document.getElementById('conv-result');
    
    // Eğer input boşsa, 0.00 yazma, --- yaz
    if(!inp || inp.value === '') { 
        if(res) res.innerText = '---'; 
        return; 
    }
    
    const val = parseFloat(inp.value);
    const rate = state.rates[state.convTo] / state.rates[state.convFrom];
    if(res) res.innerText = (val * rate).toFixed(2) + ' ' + state.convTo;
}

function swapCurrencies() { 
    [state.convFrom, state.convTo] = [state.convTo, state.convFrom]; 
    updateConverterUI(); 
    convert(); 
}

// --- GRID ve LİSTELER ---
function renderGrid() {
    const el = document.getElementById('dashboard-grid');
    if(!el) return;
    const sym = getSymbol(state.baseCurrency);
    
    el.innerHTML = state.favs.map(c => {
        const val = getPrice(c);
        const flag = getFlagUrl(c);
        let img = flag ? `<img src="${flag}" class="w-8 h-8 rounded-full shadow-sm">` : `<div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">${c[0]}</div>`;
        if(c==='XAU') img = `<div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"><i data-lucide="coins" size="16"></i></div>`;
        
        return `<div class="bg-white dark:bg-cardDark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
            <div class="flex justify-between items-center mb-2 relative z-10">
                ${img}
                <span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">+0.4%</span>
            </div>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">${c} / ${state.baseCurrency}</p>
            <p class="text-xl font-black text-slate-800 dark:text-white relative z-10">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
        </div>`;
    }).join('');
    lucide.createIcons();
}

function renderCryptoGrid() {
    const el = document.getElementById('crypto-grid');
    if(!el) return;
    const sym = getSymbol(state.baseCurrency);
    
    el.innerHTML = state.cryptoFavs.map(c => {
        const icon = CRYPTO_ICONS[c] || 'btc';
        return `<div class="bg-white dark:bg-cardDark p-4 rounded-[1.5rem] shadow-sm flex justify-between items-center border border-slate-100 dark:border-white/5">
            <div class="flex items-center gap-3">
                <img src="https://assets.coincap.io/assets/icons/${icon}@2x.png" class="w-10 h-10 rounded-full bg-white shadow-sm" onerror="this.src='https://assets.coincap.io/assets/icons/btc@2x.png'">
                <div><span class="font-bold block text-slate-800 dark:text-white">${c}</span><span class="text-[10px] text-slate-400 uppercase">Coin</span></div>
            </div>
            <div class="text-right">
                <span class="block font-bold text-slate-800 dark:text-white">${sym} ${getPrice(c).toLocaleString(undefined, {maximumFractionDigits:2})}</span>
            </div>
        </div>`;
    }).join('');
}

function renderPortfolio() {
    const list = document.getElementById('portfolio-list');
    const totalEl = document.getElementById('portfolio-total');
    if(!list) return;
    
    const sym = getSymbol(state.baseCurrency);
    let total = 0;
    
    if(state.portfolio.length === 0) {
        list.innerHTML = `<div class="text-center p-8 opacity-40"><i data-lucide="wallet" class="mx-auto mb-2 text-slate-400"></i><p class="text-xs">Boş / Empty</p></div>`;
    } else {
        list.innerHTML = state.portfolio.map((p, idx) => {
            const val = getPrice(p.symbol) * p.amount;
            total += val;
            return `<div class="flex justify-between items-center p-3 bg-white dark:bg-cardDark rounded-xl border border-slate-50 dark:border-white/5">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold">${p.symbol}</div>
                    <div><p class="font-bold text-sm dark:text-white">${p.symbol}</p><p class="text-xs text-slate-400">${p.amount}</p></div>
                </div>
                <div class="text-right">
                     <p class="font-bold text-sm dark:text-white">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
                     <button onclick="deleteAsset(${idx})" class="text-[10px] text-red-400">Sil</button>
                </div>
            </div>`;
        }).join('');
    }
    if(totalEl) totalEl.innerText = total.toLocaleString(undefined, {maximumFractionDigits:2});
    lucide.createIcons();
}

function deleteAsset(index) {
    state.portfolio.splice(index, 1);
    localStorage.setItem('portfolio', JSON.stringify(state.portfolio));
    renderPortfolio();
}

// --- YARDIMCI FONKSİYONLAR ---
function getFlagUrl(c) { return FLAG_MAP[c] ? `https://flagcdn.com/w80/${FLAG_MAP[c]}.png` : null; }
function getSymbol(c) { const s={'PLN':'zł','USD':'$','EUR':'€','TRY':'₺'}; return s[c]||c; }
function getPrice(c) { let r = state.rates[c] || 1; if(c=='BTC') r=1/65000; return (1/r)*state.rates[state.baseCurrency]; }
function startNewsTicker() { const c = document.getElementById('news-ticker'); const m = NEWS_DATA[state.lang] || NEWS_DATA['en']; if(c) c.innerHTML = m.map(x => `<div class="inline-block px-4"><span class="text-indigo-500">●</span> ${x}</div>`).join(''); }
function updateBaseCurrencyUI() { const el = document.getElementById('settings-code'); if(el) el.innerText = state.baseCurrency; const img = document.getElementById('settings-flag'); if(img) { img.src = getFlagUrl(state.baseCurrency); img.style.display='block'; } }
function setTheme(c) { state.theme=c; localStorage.setItem('theme',c); document.documentElement.style.setProperty('--theme-color', c); }

// --- MENÜ FONKSİYONLARI ---
function nav(p) { document.querySelectorAll('.page-section').forEach(x=>x.classList.remove('active')); document.getElementById('page-'+p).classList.add('active'); if(document.getElementById('sidebar').style.transform === 'translateX(0px)') toggleSidebar(); }
function toggleSidebar() { const sb = document.getElementById('sidebar'); const ov = document.getElementById('overlay'); const open = sb.style.transform === 'translateX(0px)'; sb.style.transform = open ? 'translateX(-100%)' : 'translateX(0px)'; ov.classList.toggle('hidden', open); }
function toggleLangMenu() { document.getElementById('lang-dropdown').classList.toggle('hidden'); document.getElementById('lang-dropdown').classList.toggle('flex'); }
function closeAllDrawers() { document.getElementById('selector-drawer').classList.add('hidden'); document.getElementById('overlay').classList.add('hidden'); document.getElementById('sidebar').style.transform = 'translateX(-100%)'; }
function openSelector(m) { state.drawerMode=m; const d=document.getElementById('selector-drawer'); d.classList.remove('hidden'); document.getElementById('drawer-panel').classList.remove('translate-y-full'); renderDrawerList(); }
function renderDrawerList() { 
    const list = document.getElementById('drawer-list');
    let items = state.drawerMode==='grid' ? Object.keys(FLAG_MAP) : (state.drawerMode.includes('crypto') ? Object.keys(CRYPTO_ICONS) : Object.keys(state.rates));
    list.innerHTML = items.map(c => `<button onclick="selectItem('${c}')" class="w-full text-left p-3 border-b border-gray-50 dark:border-white/5 font-bold text-slate-700 dark:text-white flex items-center gap-3">${getFlagUrl(c)?`<img src="${getFlagUrl(c)}" class="w-6 rounded">`:''} ${c}</button>`).join('');
}
function selectItem(c) {
    if(state.drawerMode==='from') { state.convFrom=c; updateConverterUI(); convert(); }
    else if(state.drawerMode==='to') { state.convTo=c; updateConverterUI(); convert(); }
    else if(state.drawerMode==='settings') { state.baseCurrency=c; localStorage.setItem('baseCurr',c); updateUI(); }
    closeAllDrawers();
}
