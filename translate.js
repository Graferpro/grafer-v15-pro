// --- TOOLS YÖNETİCİSİ & BASİT HESAPLAMALAR ---

// 1. Menü Açma/Kapama (Navigasyon)
function openTool(toolName) {
    // Ana menüyü gizle
    document.getElementById('tools-menu').classList.add('hidden');
    // Seçilen aracı göster
    const toolEl = document.getElementById('tool-' + toolName);
    if (toolEl) toolEl.classList.remove('hidden');
    
    // İkonları yenile (Eğer yüklenmemişse)
    if(window.lucide) lucide.createIcons();
}

function closeTool() {
    // Açık olan tüm araç pencerelerini gizle
    document.querySelectorAll('.tool-container').forEach(el => el.classList.add('hidden'));
    // Ana menüyü geri getir
    document.getElementById('tools-menu').classList.remove('hidden');
}

// 2. Kredi Hesaplama Mantığı
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('loan-rate').value);
    const months = parseFloat(document.getElementById('loan-months').value);

    if (!amount || !rate || !months) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    const monthlyRate = rate / 100;
    let monthlyPayment = 0;
    
    if (rate === 0) {
        monthlyPayment = amount / months;
    } else {
        const factor = Math.pow(1 + monthlyRate, months);
        monthlyPayment = (amount * monthlyRate * factor) / (factor - 1);
    }

    const totalPayment = monthlyPayment * months;

    document.getElementById('loan-monthly').innerText = monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('loan-total').innerText = totalPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    document.getElementById('loan-result').classList.remove('hidden');
}
