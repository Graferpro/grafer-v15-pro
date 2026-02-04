
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const splash = document.getElementById('splash');
    const splashVideo = document.getElementById('splash-video');
    const neonOverlay = document.querySelector('.neon-overlay');
    const appContainer = document.getElementById('app-container');

    // Video oynatmaya başlar başlamaz neon overlay'i gizle
    splashVideo.addEventListener('playing', () => {
        neonOverlay.style.opacity = '0';
    });

    // Video bitince veya belirli bir süre sonra splash ekranı kapat
    const splashDuration = 3500; // 3.5 saniye
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            appContainer.style.display = 'block'; // Uygulama içeriğini görünür yap
            loadData(); // Verileri yüklemeye başla
        }, 800); // Opaklık geçişi süresi
    }, splashDuration);

    // Navigasyon butonları
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');
            // İlgili sayfa içeriğini burada gösterebiliriz
            // Örneğin: const pageId = e.currentTarget.dataset.page;
            // document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            // document.getElementById(pageId).classList.add('active');
        });
    });
});

async function loadData() {
    try {
        const res = await fetch('/api/proxy?type=forex');
        const data = await res.json();
        const tryVal = data.results.TRY;

        document.getElementById('usd-val').innerText = (1 / data.results.USD * tryVal).toFixed(2);
        document.getElementById('eur-val').innerText = (1 / data.results.EUR * tryVal).toFixed(2);
        
        const goldRes = await fetch('/api/proxy?type=gold&symbol=XAU');
        const goldData = await goldRes.json();
        document.getElementById('gold-val').innerText = (goldData.price * tryVal).toFixed(0) + " ₺";

    } catch (error) {
        console.error("Veri hatası:", error);
        document.getElementById('usd-val').innerText = "N/A";
        document.getElementById('eur-val').innerText = "N/A";
        document.getElementById('gold-val').innerText = "N/A";
    }
}
