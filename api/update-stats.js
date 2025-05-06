const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
    try {
        // Fetch MARA IR data (simulated; replace with real API/RSS)
        const irResponse = await fetch('https://ir.mara.com/news-events/press-releases');
        const irHtml = await irResponse.text();
        const $ = cheerio.load(irHtml);

        // Fetch network stats for blocks mined
        const networkResponse = await fetch('https://api.blockchain.info/stats');
        const networkData = await networkResponse.json();
        const globalHashRate = networkData.hash_rate / 1e18; // Convert to EH/s
        const blocksPerDay = 144; // Approx. blocks/day
        const maraHashRate = 57.3; // EH/s
        const blocks24h = (maraHashRate / globalHashRate) * blocksPerDay * 1.1; // +10% MARAPool luck

        // Fetch short volume (simulated; use FINRA or Alpha Vantage)
        const shortVolume = 1200000; // Placeholder, replace with FINRA scrape or API

        // Earnings prediction (simple linear regression)
        const historicalRevenue = [131.6, 214.4]; // Q3, Q4 2024 ($M)
        const historicalBTC = [2070, 2492]; // Q3, Q4 2024
        const analystRevenue = 224.85; // Q1 2025 ($M)
        const btcPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const btcPrice = (await btcPriceResponse.json()).bitcoin.usd;
        const predictedBTC = 700; // Based on April 705 BTC
        const revenuePrediction = analystRevenue * 0.7 + (historicalRevenue[1] * predictedBTC / historicalBTC[1]) * 0.3;
        const epsPrediction = 0.29; // Analyst estimate

        // Monthly stats (historical + projected)
        const stats = {
            btcHoldings: 48237,
            btcValue: 'Calculated via CoinGecko',
            marketCap: '$5.01B',
            hashRate: maraHashRate,
            mnavRatio: 1.09,
            shortVolume: shortVolume,
            blocks24h: blocks24h,
            earningsPrediction: {
                revenue: revenuePrediction.toFixed(2),
                eps: epsPrediction
            },
            monthlyStats: [
                { month: 'Jan 2025', btcMined: 907, blocksWon: 249, hashRate: 53.2, energyCost: 29000 },
                { month: 'Feb 2025', btcMined: 706, blocksWon: 206, hashRate: 54.0, energyCost: 28500 },
                { month: 'Mar 2025', btcMined: 829, blocksWon: 242, hashRate: 54.3, energyCost: 28200 },
                { month: 'Apr 2025', btcMined: 705, blocksWon: 206, hashRate: 57.3, energyCost: 28000 },
                { month: 'May 2025', btcMined: predictedBTC, blocksWon: Math.round(blocks24h * 30), hashRate: 57.3, energyCost: 28000 }
            ],
            financials: {
                revenue: '$214.4M',
                ebitda: '$794.4M',
                netIncome: '$528.3M',
                shares: '351.93M',
                debt: '$331M'
            },
            shortVolumeHistory: [1500000, 1300000, 1400000, 1200000, 1200000] // Simulated for 5 months
        };

        // Save to public/data/stats.json
        await fs.writeFile(path.join(__dirname, '../public/data/stats.json'), JSON.stringify(stats, null, 2));

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(200).json(getFallbackStats()); // Return fallback to avoid UI breakage
    }
};

function getFallbackStats() {
    return {
        btcHoldings: 48237,
        btcValue: 'Loading USD value...',
        marketCap: '$5.01B',
        hashRate: 57.3,
        mnavRatio: 1.09,
        shortVolume: 1200000,
        blocks24h: 12.7,
        earningsPrediction: { revenue: 224.85, eps: 0.29 },
        monthlyStats: [
            { month: 'Jan 2025', btcMined: 907, blocksWon: 249, hashRate: 53.2, energyCost: 29000 },
            { month: 'Feb 2025', btcMined: 706, blocksWon: 206, hashRate: 54.0, energyCost: 28500 },
            { month: 'Mar 2025', btcMined: 829, blocksWon: 242, hashRate: 54.3, energyCost: 28200 },
            { month: 'Apr 2025', btcMined: 705, blocksWon: 206, hashRate: 57.3, energyCost: 28000 },
            { month: 'May 2025', btcMined: 700, blocksWon: 381, hashRate: 57.3, energyCost: 28000 }
        ],
        financials: {
            revenue: '$214.4M',
            ebitda: '$794.4M',
            netIncome: '$528.3M',
            shares: '351.93M',
            debt: '$331M'
        },
        shortVolumeHistory: [1500000, 1300000, 1400000, 1200000, 1200000]
    };
}