const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        // Simulate news fetch (replace with Twitter API or CoinDesk RSS)
        const newsItems = [
            { title: 'MARA Boosts Hashrate to 57.3 EH/s in April 2025', source: '@CHItraders', date: '2025-05-01', url: 'https://x.com/CHItraders/status/123456789' },
            { title: 'MARA’s Bitcoin per Share Up 113% Since July 2024', source: '@CHItraders', date: '2025-04-30', url: 'https://x.com/CHItraders/status/1784567890123456789' },
            { title: 'Bitcoin Mining Faces ESG Challenges', source: 'CoinDesk', date: '2025-05-03', url: 'https://www.coindesk.com' }
        ];
        res.status(200).json(newsItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(200).json([]);
    }
};