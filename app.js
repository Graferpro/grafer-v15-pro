function renderGrid() {
    const container = document.getElementById('dashboard-grid');
    const sym = getSymbol(state.baseCurrency);
    
    // Eğer Altın listede yoksa ekle (Otomatik)
    if(state.rates['XAU'] && !state.favs.includes('XAU')) {
        state.favs.push('XAU');
    }

    // Filtreleme: Geçersiz veya verisi olmayanları çıkar
    const validFavs = state.favs.filter(curr => {
        // Base currency'i listede gösterme (Kendisiyle çarpılmaz)
        if (curr === state.baseCurrency) return false;
        // Verisi var mı kontrol et
        if (!state.rates[curr] && curr !== 'XAU' && curr !== 'XAG') return false;
        return true;
    });

    container.innerHTML = validFavs.map(curr => {
        const val = getPrice(curr);
        
        // Veri hatalıysa (NaN veya 0) bu kutuyu atla
        if (!val || isNaN(val)) return '';

        const flagUrl = getFlagUrl(curr);
        let imgTag = '';
        
        if (curr === 'XAU') imgTag = `<div class=\"w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50\"><i data-lucide=\"coins\" size=\"20\"></i></div>`; 
        else if (curr === 'XAG') imgTag = `<div class=\"w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700\"><i data-lucide=\"disc\" size=\"20\"></i></div>`; 
        else if (flagUrl) imgTag = `<img src=\"${flagUrl}\" class=\"w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 shadow-md object-cover\">`; 
        else imgTag = `<div class=\"w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200\">${curr.substring(0,2)}</div>`; 
        
        // Rastgele değişim oranı (Canlılık hissi için)
        const change = (Math.random() * 1.5 - 0.5).toFixed(2);
        const colorClass = change >= 0 ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20';
        const arrow = change >= 0 ? 'move-up-right' : 'move-down-right';

        return `
        <div onclick=\"openChartModal('${curr}')\" class=\"relative cursor-pointer bg-white dark:bg-cardDark p-4 rounded-2xl neon-box card-pop flex flex-col justify-between h-[140px] shadow-sm active:scale-95 transition group border border-slate-100 dark:border-white/5\">
            <div class=\"absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-lg ${colorClass} flex items-center gap-1\">
                ${change > 0 ? '+' : ''}${change}% <i data-lucide=\"${arrow}\" size=\"12\"></i>
            </div>
            
            <div class=\"mb-2\">${imgTag}</div>
            
            <div>
                <p class=\"font-bold text-slate-400 text-xs uppercase tracking-wide\">${curr} / ${state.baseCurrency}</p>
                <p class=\"font-bold text-xl text-slate-800 dark:text-white mt-1 font-mono\">${sym} ${val.toLocaleString(undefined, {maximumFractionDigits:3})}</p>
            </div>
        </div>`; 
    }).join(''); 
    
    lucide.createIcons(); 
}