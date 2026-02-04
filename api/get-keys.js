// CommonJS formatı - Vercel'de en sorunsuz çalışan yöntem
module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    
    // Anahtarları gönder
    res.status(200).json({
        API_KEY_FOREX: process.env.API_KEY_FOREX
    });
};
