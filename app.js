// --- GRAFER PRO V16 AYARLARI ---
const STOCK_SYMBOLS = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT', 'NVDA'];
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana', 'ripple'];

let state = {
    rates: {},   // Dövizler
    stocks: {},  // Hisseler
    cryptos: {}  // Kriptolar
};

window.onload = async () => {
    lucide.createIcons();
    initChart();
    
    console.log("🚀 V16 Motorları Çalıştırılıyor...");
    
    // 1. DÖVİZLERİ ÇEK
    await fetchForex();
    
    // 2. HİSSELERİ ÇEK (Tek tek soruyoruz)
    fetchStocks();

    // 3. KRİPTOLARI ÇEK
    fetchCrypto();

    // Otomatik Yenileme (Her 15 saniyede bir)
    setInterval(() => { fetchForex(); fetchStocks(); fetchCrypto(); }, 15000);
};

// --- DÖVİZ (FOREX) ---
async function fetchForex() {
    try {
        const res = await fetch('/api/proxy?type=forex');
        const data = await res.json();
        if(data.results) {
            state.rates = data.results;
            const tryRate = state.rates['TRY'];
            
            // Ana Fiyatı Güncelle (USD)
            document.getElementById('main-price').innerText = `₺ ${tryRate.toLocaleString('tr-TR', {minimumFractionDigits:4})}`;
            
            // Gridleri Doldur
            renderForexGrid();
        }
    } catch(e) { console.error("Forex Hatası:", e); }
}

function renderForexGrid() {
    const list = ['EUR', 'GBP', 'CHF', 'JPY'];
    const tryRate = state.rates['TRY'];
    const container = document.getElementById('grid-forex');
    
    container.innerHTML = list.map(code => {
        const val = (1 / state.rates[code]) * tryRate;
        return `
        <div class="bg-white dark:bg-cardDark p-4 rounded-2xl neon-box shadow-sm card-pop">
            <div class="flex justify-between items-start">
                <span class="font-bold text-slate-500 text-xs">${code}/TRY</span>
                <span class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">%0.4</span>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white mt-1">₺ ${val.toLocaleString('tr-TR', {maximumFractionDigits:2})}</p>
        </div>`;
    }).join('');
}

// --- HİSSE SENETLERİ (STOCKS) ---
async function fetchStocks() {
    const container = document.getElementById('list-stocks');
    container.innerHTML = ''; // Temizle

    for (const sym of STOCK_SYMBOLS) {
        try {
            // Proxy üzerinden Finnhub'a soruyoruz
            const res = await fetch(`/api/proxy?type=stock&symbol=${sym}`);
            const data = await res.json();
            
            // Finnhub veri yapısı: c = current price, dp = percent change
            const price = data.c;
            const change = data.dp; 
            const colorClass = change >= 0 ? 'text-green-500' : 'text-red-500';
            const bgClass = change >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
            const arrow = change >= 0 ? '↑' : '↓';

            const html = `
            <div class="flex items-center justify-between bg-white dark:bg-cardDark p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">${sym[0]}</div>
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-white">${sym}</h4>
                        <p class="text-xs text-slate-400">Nasdaq</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold text-lg text-slate-800 dark:text-white">$${price}</p>
                    <span class="text-xs font-bold ${colorClass} px-2 py-1 rounded-lg ${bgClass}">${arrow} %${change ? change.toFixed(2) : '0.00'}</span>
                </div>
            </div>`;
            
            container.innerHTML += html;

        } catch(e) { console.warn(`Hisse Hatası (${sym}):`, e); }
    }
}

// --- KRİPTO (Coincap - Public API) ---
async function fetchCrypto() {
    try {
        const res = await fetch('https://api.coincap.io/v2/assets?limit=6');
        const data = await res.json();
        const container = document.getElementById('grid-crypto');
        
        container.innerHTML = data.data.slice(0, 4).map(coin => {
            const price = parseFloat(coin.priceUsd);
            const change = parseFloat(coin.changePercent24Hr);
            const color = change >= 0 ? 'text-green-500' : 'text-red-500';
            
            return `
            <div class="bg-white dark:bg-cardDark p-4 rounded-2xl neon-box shadow-sm">
                <div class="flex items-center gap-2 mb-2">
                    <img src="https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png" class="w-6 h-6 rounded-full">
                    <span class="font-bold text-sm">${coin.symbol}</span>
                </div>
                <p class="font-bold text-lg">$${price.toLocaleString(undefined, {maximumFractionDigits:2})}</p>
                <p class="text-xs font-bold ${color}">%${change.toFixed(2)}</p>
            </div>`;
        }).join('');
    } catch(e) {}
}

// --- GRAFİK ---
function initChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                data: Array(20).fill(34).map(x => x + Math.random()),
                borderColor: '#4f46e5',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
                fill: true,
                backgroundColor: '#4f46e520'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
}

function scrollToId(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
