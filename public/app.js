document.addEventListener('DOMContentLoaded', () => {
    // İkonları yükle
    lucide.createIcons();

    // Splash Ekranını Kapat (3.5 Saniye Sonra)
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
        }, 800);
    }, 3500);

    // Verileri Getir
    loadData();
});

async function loadData() {
    try {
        const res = await fetch('/api/proxy?type=forex');
        const data = await res.json();
        const tryVal = data.results.TRY;

        // Dolar, Euro hesapla
        document.getElementById('usd-val').innerText = (1 / data.results.USD * tryVal).toFixed(2);
        document.getElementById('eur-val').innerText = (1 / data.results.EUR * tryVal).toFixed(2);
        
        // Altın verisi için ayrı çağrı (örnek)
        const goldRes = await fetch('/api/proxy?type=gold&symbol=XAU');
        const goldData = await goldRes.json();
        document.getElementById('gold-val').innerText = (goldData.price * tryVal).toFixed(0) + " ₺";

    } catch (error) {
        console.error("Veri hatası:", error);
    }
}

