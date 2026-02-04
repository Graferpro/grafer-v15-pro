// --- AYARLAR ---
const FALLBACK_KEY = 'bd037c8df3-e9e9dee6a5-t9tvbi'; // Vercel çalışmazsa bu devreye girer
let state = {
    rates: {},
    baseCurrency: 'TRY',
    chartPair: 'USD',
    theme: '#4f46e5'
};

// --- BAŞLAT ---
window.onload = async () => {
    lucide.createIcons();
    initChart();
    await fetchData(); // Veriyi çek
    document.getElementById('loading-screen').style.display = 'none'; // Yükleme ekranını kapat
    updateUI();
    
    // Canlı grafik simülasyonu başlat
    setInterval(updateChartSimulation, 1000);
};

// --- VERİ ÇEKME (PROXY SİSTEMİ) ---
async function fetchData() {
    try {
        console.log("📡 Veriler sunucudan isteniyor...");
        
        // 1. Önce güvenli proxy'yi dene
        const res = await fetch('/api/proxy');
        
        if (res.ok) {
            const data = await res.json();
            if (data.results) {
                state.rates = data.results;
                console.log("✅ Proxy üzerinden veri alındı!");
                return;
            }
        }
        
        throw new Error("Proxy başarısız");

    } catch (e) {
        console.warn("⚠️ Proxy hatası, yedek yöntem deneniyor...", e);
        
        // 2. Proxy çalışmazsa yedek anahtarla direkt çek (Fallback)
        try {
            const url = `https://api.fastforex.io/fetch-all?api_key=${FALLBACK_KEY}`;
            const res2 = await fetch(url);
            const data2 = await res2.json();
            state.rates = data2.results;
            console.log("✅ Yedek anahtarla veri alındı.");
        } catch (err) {
            console.error("❌ HATA: Hiçbir şekilde veri alınamadı.", err);
            alert("Veri çekilemedi. İnternet bağlantınızı kontrol edin.");
        }
    }
}

// --- ARA YÜZ GÜNCELLEME ---
function updateUI() {
    if (!state.rates['USD']) return;

    // Gridleri oluştur
    const favs = ['USD', 'EUR', 'GBP', 'GA']; // Altın (GA) sembolik
    const grid = document.getElementById('dashboard-grid');
    
    // TRY Bazlı Fiyat Hesaplama
    const tryRate = state.rates['TRY'];
    
    grid.innerHTML = favs.map(curr => {
        let val = 0;
        if (curr === 'GA') val = (1 / (state.rates['XAU'] || 0.0004)) * tryRate / 31.1; // Altın (Gram)
        else val = (1 / state.rates[curr]) * tryRate;
        
        return `
        <div class="bg-white dark:bg-cardDark p-4 rounded-2xl neon-box card-pop flex flex-col gap-2 shadow-sm">
            <div class="flex justify-between items-start">
                <span class="font-bold text-lg">${curr}</span>
                <span class="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">CANLI</span>
            </div>
            <div>
                <p class="font-bold text-slate-500 text-xs">${curr}/TRY</p>
                <p class="font-bold text-xl text-slate-800 dark:text-white">₺ ${val.toLocaleString('tr-TR', {maximumFractionDigits:2})}</p>
            </div>
        </div>`;
    }).join('');

    // Çeviriciyi güncelle
    convert();
}

// --- ÇEVİRİCİ ---
function convert() {
    const amt = parseFloat(document.getElementById('conv-amount').value);
    const usdToTry = (1 / state.rates['USD']) * state.rates['TRY'];
    const res = amt * usdToTry;
    document.getElementById('conv-result').innerText = res.toLocaleString('tr-TR', {maximumFractionDigits:2});
}

// --- GRAFİK (Chart.js) ---
let myChart;
function initChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                data: Array(20).fill(34.50), // Başlangıç verisi
                borderColor: state.theme,
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 0,
                fill: true,
                backgroundColor: state.theme + '33'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }
    });
}

function updateChartSimulation() {
    if (!myChart || !state.rates['USD']) return;
    
    // Basit simülasyon: Gerçek kur etrafında küçük oynamalar
    const realPrice = (1 / state.rates['USD']) * state.rates['TRY'];
    const randomFluctuation = realPrice * (1 + (Math.random() - 0.5) * 0.001);
    
    const data = myChart.data.datasets[0].data;
    data.shift();
    data.push(randomFluctuation);
    myChart.update('none'); // Animasyonsuz güncelle

    document.getElementById('chart-price').innerText = '₺ ' + randomFluctuation.toLocaleString('tr-TR', {maximumFractionDigits:4});
}

