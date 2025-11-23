const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// List of URLs to keep alive
const targets = [
    'https://excel-cleaner.onrender.com',
    'https://lsf-detector.onrender.com',
    'https://taskmate-demo.vercel.app', // Vercel doesn't sleep but good to check
    'https://social-media-api-demo.onrender.com',
    'https://anime-recommendation-demo.onrender.com',
    'https://mapy-demo.onrender.com',
    'https://pin-collector-demo.onrender.com',
    'https://walking-ai-demo.onrender.com',
    'https://ninety-nine-game.vercel.app',
    'https://pong-game-demo.vercel.app',
    'https://snake-game-demo.vercel.app',
    'https://calculator-js-demo.vercel.app',
    'https://guess-the-number-demo.vercel.app',
    'https://pmu-game-demo.vercel.app',
    'https://folder-analyzer-web.vercel.app',
    'https://blackjack-simulator-demo.onrender.com'
];

// Helper to get random delay between 1 and 14 minutes (in ms)
const getRandomDelay = () => {
    const min = 1 * 60 * 1000;
    const max = 14 * 60 * 1000;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const pingTargets = async () => {
    console.log(`[${new Date().toISOString()}] Starting ping cycle...`);
    
    for (const url of targets) {
        try {
            const start = Date.now();
            await axios.get(url, { timeout: 10000 });
            const duration = Date.now() - start;
            console.log(`✅ Pinged ${url} (${duration}ms)`);
        } catch (error) {
            console.error(`❌ Failed to ping ${url}: ${error.message}`);
        }
    }

    const nextDelay = getRandomDelay();
    console.log(`Next ping cycle in ${Math.round(nextDelay / 1000 / 60)} minutes.`);
    setTimeout(pingTargets, nextDelay);
};

// API Endpoint to manually trigger or check status
app.get('/api/status', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ 
        status: 'online', 
        targets: targets.length, 
        message: 'Keeper of the flame is active.',
        lastPing: new Date().toISOString()
    });
});

// Simple client interface (optional, now we have a separate client)
app.get('/', (req, res) => {
    res.send('Server is running. Check /api/status');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start the ping loop
    pingTargets();
});
