// Updated fetchData function to use real public APIs
async function fetchData() {
    // Forex API Endpoint
    const forexResponse = await fetch('https://api.exchangeratesapi.io/latest');
    const forexData = await forexResponse.json();

    // Gold API Endpoint
    const goldResponse = await fetch('https://metals-api.com/api/latest?access_key=YOUR_ACCESS_KEY');
    const goldData = await goldResponse.json();

    return {
        forex: forexData,
        gold: goldData
    };
}

// Updated askOpenAI function to use real OpenAI API
async function askOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}