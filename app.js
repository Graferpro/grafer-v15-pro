// --- GRAFER PRO CORE (v2.7 - AUTO LOCATION & FIXED GRID) ---
const APP_VERSION = '2.7'; 

// --- SABİT VERİLER ---
const FLAG_MAP = {'USD':'us', 'EUR':'eu', 'GBP':'gb', 'TRY':'tr', 'JPY':'jp', 'CNY':'cn', 'RUB':'ru', 'CHF':'ch', 'CAD':'ca', 'AUD':'au', 'PLN':'pl', 'SEK':'se', 'NOK':'no', 'DKK':'dk', 'BRL':'br', 'INR':'in', 'MXN':'mx', 'KRW':'kr', 'IDR':'id', 'ZAR':'za', 'SAR':'sa', 'AED':'ae', 'GEL':'ge'};
const CURRENCY_NAMES = {'USD':'Dollar', 'EUR':'Euro', 'GBP':'Pound', 'TRY':'Lira', 'PLN':'Złoty', 'JPY':'Yen', 'RUB':'Ruble', 'GEL':'Lari', 'XAU':'Ons Altın', 'XAG':'Ons Gümüş'};
const CRYPTO_ICONS = {'BTC':'btc', 'ETH':'eth', 'SOL':'sol', 'XRP':'xrp', 'ADA':'ada', 'DOGE':'doge', 'DOT':'dot', 'MATIC':'matic', 'LTC':'ltc', 'AVAX':'avax'};

// DİL DESTEĞİ
const I18N = {
    en: { dark_mode: "Dark Mode", dashboard: "Market", portfolio: "Portfolio", crypto: "Crypto", converter: "Converter", settings: "Settings", market: "Market", edit: "Edit", total_asset: "TOTAL ASSETS", add: "Add", reset: "Reset", crypto_assets: "Crypto Assets", theme_color: "Theme Color", default_currency: "Default Currency", ai_analysis: "AI Analysis", ai_title: "Grafer Pro Ai Assistant", ai_subtitle: "Market Analysis", close: "Close", analyzing: "Analyzing...", enter_amount: "Enter Amount...", result: "RESULT", quantity_title: "Quantity", tools: "Tools", loan_calc: "Loan Calc", translator: "Translator", back: "Back", loan_amount: "Loan Amount", interest_rate: "Interest (%)", term_months: "Term (Months)", calculate: "CALCULATE", monthly_payment: "Monthly Payment", total_payment: "Total Payment", fast_translate: "Fast Translate", ai_translate: "AI Translate", clear: "CLEAR", auto: "Auto" },
    tr: { dark_mode: "Gece Modu", dashboard: "Piyasa", portfolio: "Portföy", crypto: "Kripto", converter: "Çevirici", settings: "Ayarlar", market: "Piyasa", edit: "Düzenle", total_asset: "TOPLAM VARLIK", add: "Ekle", reset: "Sıfırla", crypto_assets: "Kripto Varlıklar", theme_color: "Tema Rengi", default_currency: "Varsayılan Para Birimi", ai_analysis: "AI Analiz", ai_title: "Grafer Pro Ai Asistan", ai_subtitle: "Piyasa Analizi", close: "Kapat", analyzing: "Analiz ediliyor...", enter_amount: "Miktarı Girin...", result: "SONUÇ", quantity_title: "Miktar", tools: "Araçlar", loan_calc: "Kredi Hesapla", translator: "Çevirici", back: "Geri", loan_amount: "Kredi Tutarı", interest_rate: "Faiz (%)", term_months: "Vade (Ay)", calculate: "HESAPLA", monthly_payment: "Aylık Taksit", total_payment: "Toplam Ödeme", fast_translate: "Hızlı Çevir", ai_translate: "AI Çeviri", clear: "TEMİZLE", auto: "Otomatik" },
    // ... Diğer dilleri buraya ekleyebilirsin (yer kaplamasın diye kısalttım) ...
};

// HABERLER
const FALLBACK_NEWS = { en: [{text: "Global markets update."}], tr: [{text: "Küresel piyasalar güncellendi."}] };

// --- STATE ---
let state = {
    rates: {}, baseCurrency: 'USD', chartPair: 'USD', isChartSwapped: false, vsPair: null,
    lang: 'en', theme: localStorage.getItem('theme') || '#4f46e5',
    // SABİT LİSTE: Altın, Gümüş, USD, EUR, GBP (Sırasıyla)
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

    // Dili tarayıcıdan algıla
    const browserLang = navigator.language.slice(0, 2);
    state.lang = localStorage.getItem('lang') || (I18N[browserLang] ? browserLang : 'en');
    setLanguage(state.lang);
    setTheme(state.theme);
    
    initChart('mainChart', state.theme);
    initChart('cryptoChart', '#f97316');
    
    await fetchData(); 
    await detectLocationCurrency(); // Konumu bul ve 6. kutuyu doldur
    
    updateUI(); startLiveSimulations();
    
    const tvScript = document.createElement('script'); tvScript.src = 'https://s3.tradingview.com/tv.js'; document.head.appendChild(tvScript);
};

// --- KONUMDAN PARA BİRİMİ BULMA VE 6. KUTU ---
async function detectLocationCurrency() {
    // Eğer kullanıcı daha önce elle değiştirdiyse ona dokunma
    if (localStorage.getItem('baseCurr')) { 
        state.baseCurrency = localStorage.getItem('baseCurr'); 
    } else {
        try { 
            const geoRes = await fetch('https://ipapi.co/json/'); 
            const geoData = await geoRes.json(); 
            const userCurrency = geoData.currency; 
            
            if (userCurrency && (state.rates[userCurrency] || userCurrency === 'TRY')) { 
                state.baseCurrency = userCurrency; 
                localStorage.setItem('baseCurr', userCurrency); 
            } 
        } catch (err) { console.log("Konum bulunamadı, varsayılan USD."); }
    }

    // --- 6. KUTUYU DOLDURMA MANTIĞI ---
    // Listemiz: XAU, XAG, USD, EUR, GBP (5 tane sabit)
    // 6. sıraya kullanıcının ana para birimini koymayalım (çünkü 1 = 1 olur).
    // Onun yerine, eğer ana para birimi listede yoksa onu ekleyelim, varsa popüler başka bir şey (örn. JPY veya BTC) ekleyelim.
    
    // Temiz bir liste yapalım
    let newFavs = ['XAU', 'XAG', 'USD', 'EUR', 'GBP'];
    
    // Eğer baseCurrency (örn: TRY) bu listede varsa, onu listeden çıkarıp yerine başkasını koymalıyız
    // Çünkü "TRY/TRY = 1" görmek saçma olur.
    
    // Eğer kullanıcının parası TRY ise ve listede yoksa, ekle.
    if (!newFavs.includes(state.baseCurrency)) {
       // Listeye ekleme yapmıyoruz çünkü Base Currency zaten karşılaştırma bazımız.
       // Grid fonksiyonunda base currency'i otomatik filtrelicez.
    }
    
    // 6. Eleman olarak, kullanıcının bölgesine göre değil, listede olmayan popüler bir şey ekleyelim.
    if(state.baseCurrency !== 'JPY' && !newFavs.includes('JPY')) newFavs.push('JPY');
    else if(state.baseCurrency !== 'CNY') newFavs.push('CNY');

    state.favs = newFavs;
    updateUI();
}

// --- FİYAT ÇEKME ---
async function fetchData() { 
    try { 
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD'); // Ücretsiz, anahtarsız API
        const data = await res.json(); 
        if(data.rates) state.rates = data.rates; 
        
        // Altın/Gümüş (Yaklaşık Değerler - API yoksa)
        state.rates['XAU'] = 1 / 2740; // 1 USD = X Altın
        state.rates['XAG'] = 1 / 32.50; 
    } catch(e) { 
        console.log("API Hatası, offline mod.");
        state.rates = {'USD':1, 'EUR':0.92, 'TRY':34.2, 'PLN':4.0, 'GBP':0.77, 'XAU': 1/2740, 'XAG': 1/32.50}; 
    } 
}

function getPrice(code) { 
    let rateCode = state.rates[code]; 
    if(!rateCode) { 
        if(code==='BTC') rateCode = 1/97000; else if(code==='ETH') rateCode = 1/2700; else if(code==='XAU') rateCode = 1/2740; else if(code==='XAG') rateCode = 1/32.50; else rateCode = 1; 
    } 
    // Formül: (1 / Hedef Kur) * (Baz Kur)
    // Örnek: USD/TRY için -> (1 / 1) * 34 = 34
    return (1 / rateCode) * state.rates[state.baseCurrency]; 
}

// --- GRID (KUTULAR) DÜZENLEME ---
function renderGrid() {
    const container = document.getElementById('dashboard-grid');
    const sym = getSymbol(state.baseCurrency);
    
    // Listeden Base Currency'i (örn. TRY ise TRY'yi) çıkar. Kendisiyle çarpılmaz.
    const validFavs = state.favs.filter(c => c !== state.baseCurrency);

    container.innerHTML = validFavs.map(curr => {
        const val = getPrice(curr);
        const flagUrl = getFlagUrl(curr);
        
        let imgTag = '';
        if (curr === 'XAU') imgTag = `<div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 border border-yellow-200"><i data-lucide="coins" size="20"></i></div>`; 
        else if (curr === 'XAG') imgTag = `<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><i data-lucide="disc" size="20"></i></div>`; 
        else if (flagUrl) imgTag = `<img src="${flagUrl}" class="w-10 h-10 rounded-full border border-gray-200 shadow-md object-cover">`; 
        else imgTag = `<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">${curr.substring(0,2)}</div>`; 

        // Sayı Formatı (Altın için virgüllü değil noktalı binlik ayracı)
        let formattedVal = val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 3});

        return `
        <div onclick="openChartModal('${curr}')" class="relative cursor-pointer bg-white dark:bg-cardDark p-4 rounded-2xl neon-box flex flex-col justify-between h-[140px] shadow-sm border border-slate-100 dark:border-white/5 active:scale-95 transition">
            <div class="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-lg bg-green-50 text-green-500 flex items-center gap-1">+0.4% <i data-lucide="trending-up" size="12"></i></div>
            <div class="mb-2">${imgTag}</div>
            <div>
                <p class="font-bold text-slate-400 text-xs uppercase tracking-wide">${curr} / ${state.baseCurrency}</p>
                <p class="font-bold text-xl text-slate-800 dark:text-white mt-1 font-mono">${sym} ${formattedVal}</p>
            </div>
        </div>`; 
    }).join(''); 
    
    if(window.lucide) lucide.createIcons(); 
}

// --- DİĞER STANDART FONKSİYONLAR ---
function updateUI() { updateBaseCurrencyUI(); updateConverterUI(); renderGrid(); renderCryptoGrid(); renderPortfolio(); }
function getSymbol(curr) { const symbols = {'PLN':'zł', 'USD':'$', 'EUR':'€', 'TRY':'₺', 'GBP':'£'}; return symbols[curr] || curr; }
function getFlagUrl(code) { return FLAG_MAP[code] ? `https://flagcdn.com/w80/${FLAG_MAP[code]}.png` : null; }
function setLanguage(lang) { state.lang = lang; localStorage.setItem('lang', lang); document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if(I18N[lang][k]) el.innerText = I18N[lang][k]; }); document.getElementById('lang-dropdown').classList.add('hidden'); }
function setTheme(color) { state.theme = color; localStorage.setItem('theme', color); document.documentElement.style.setProperty('--theme-color', color); }
function toggleLangMenu() { document.getElementById('lang-dropdown').classList.toggle('hidden'); }
function nav(p) { document.querySelectorAll('.page-section').forEach(x=>x.classList.remove('active')); document.getElementById('page-'+p).classList.add('active'); }
function toggleSidebar() { const s = document.getElementById('sidebar'); s.style.transform = s.style.transform === 'translateX(0px)' ? 'translateX(-100%)' : 'translateX(0px)'; document.getElementById('overlay').classList.toggle('hidden'); }
// ... (Diğer Crypto, Portföy, Converter fonksiyonları v2.6 ile aynı kalacak) ...
// Eğer tam kodu istersen, kalan kısımları da ekleyip tek parça atabilirim.
