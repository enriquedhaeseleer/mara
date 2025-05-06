// Initialize GSAP Animations
gsap.registerPlugin(ScrollTrigger);
document.querySelectorAll('section').forEach(section => {
    gsap.to(section, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
        }
    });
});

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');

// Fetch Stats from Vercel Function
async function fetchStats() {
    try {
        const response = await fetch('/api/update-stats');
        const data = await response.json();
        updateStats(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
        updateStats(getFallbackStats());
    }
}

function updateStats(data) {
    // Update Quick Stats (index.html, stats.html)
    if (document.getElementById('btc-holdings')) {
        document.getElementById('btc-holdings').textContent = `${data.btcHoldings.toLocaleString()} BTC`;
        document.getElementById('btc-value').textContent = data.btcValue;
    }
    if (document.getElementById('market-cap')) {
        document.getElementById('market-cap').textContent = data.marketCap;
    }
    if (document.getElementById('hash-rate')) {
        document.getElementById('hash-rate').textContent = `${data.hashRate} EH/s`;
    }
    if (document.getElementById('mnav-ratio')) {
        document.getElementById('mnav-ratio').textContent = data.mnavRatio.toFixed(2);
    }
    if (document.getElementById('short-volume')) {
        document.getElementById('short-volume').textContent = `${data.shortVolume.toLocaleString()} shares`;
    }
    if (document.getElementById('blocks-24h')) {
        document.getElementById('blocks-24h').textContent = data.blocks24h.toFixed(1);
    }
    if (document.getElementById('earnings-prediction')) {
        document.getElementById('earnings-prediction').textContent = `$${data.earningsPrediction.revenue}M, ${data.earningsPrediction.eps} EPS`;
    }

    // Update Monthly Stats Table (stats.html)
    if (document.getElementById('monthly-stats')) {
        const tbody = document.getElementById('monthly-stats').querySelector('tbody');
        tbody.innerHTML = '';
        data.monthlyStats.forEach(stat => {
            tbody.innerHTML += `
                <tr>
                    <td>${stat.month}</td>
                    <td>${stat.btcMined}</td>
                    <td>${stat.blocksWon}</td>
                    <td>${stat.hashRate}</td>
                    <td>$${stat.energyCost.toLocaleString()}</td>
                </tr>
            `;
        });
    }

    // Update Financials (stats.html)
    if (document.getElementById('financials')) {
        document.getElementById('financials').innerHTML = `
            <li>Revenue: ${data.financials.revenue}</li>
            <li>Adjusted EBITDA: ${data.financials.ebitda}</li>
            <li>Net Income/Loss: ${data.financials.netIncome}</li>
            <li>Shares Outstanding: ${data.financials.shares}</li>
            <li>Debt: ${data.financials.debt}</li>
        `;
    }

    // Update Charts (stats.html)
    if (document.getElementById('btcProductionChart')) {
        new Chart(document.getElementById('btcProductionChart'), {
            type: 'line',
            data: {
                labels: data.monthlyStats.map(stat => stat.month),
                datasets: [{
                    label: 'BTC Mined',
                    data: data.monthlyStats.map(stat => stat.btcMined),
                    borderColor: '#f7931a',
                    backgroundColor: 'rgba(247, 147, 26, 0.2)',
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { title: { display: true, text: 'Bitcoin Production (2025)', color: '#fff' } }
            }
        });
    }
    if (document.getElementById('hashRateChart')) {
        new Chart(document.getElementById('hashRateChart'), {
            type: 'bar',
            data: {
                labels: data.monthlyStats.map(stat => stat.month),
                datasets: [{
                    label: 'Hash Rate (EH/s)',
                    data: data.monthlyStats.map(stat => stat.hashRate),
                    backgroundColor: '#f7931a',
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { title: { display: true, text: 'Hash Rate (2025)', color: '#fff' } }
            }
        });
    }
    if (document.getElementById('shortVolumeChart')) {
        new Chart(document.getElementById('shortVolumeChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Short Volume (M shares)',
                    data: data.shortVolumeHistory,
                    borderColor: '#f7931a',
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                plugins: { title: { display: true, text: 'Short Volume (2025)', color: '#fff' } }
            }
        });
    }
    if (document.getElementById('blocksMinedChart')) {
        new Chart(document.getElementById('blocksMinedChart'), {
            type: 'bar',
            data: {
                labels: data.monthlyStats.map(stat => stat.month),
                datasets: [{
                    label: 'Blocks Won',
                    data: data.monthlyStats.map(stat => stat.blocksWon),
                    backgroundColor: '#f7931a',
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { title: { display: true, text: 'Blocks Mined (2025)', color: '#fff' } }
            }
        });
    }
}

// Fallback Stats
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
            { month: 'Apr 2025', btcMined: 705, blocksWon: 206, hashRate: 57.3, energyCost: 28000 }
        ],
        financials: {
            revenue: '$214.4M',
            ebitda: '$794.4M',
            netIncome: '$528.3M',
            shares: '351.93M',
            debt: '$331M'
        },
        shortVolumeHistory: [1.5, 1.3, 1.4, 1.2, 1.2]
    };
}

// Fetch BTC Price
async function fetchBtcPrice() {
    const cached = localStorage.getItem('btcPrice');
    if (cached && Date.now() - JSON.parse(cached).timestamp < 3600000) {
        const btcPrice = JSON.parse(cached).price;
        updateBtcValue(btcPrice);
        return;
    }
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const btcPrice = data.bitcoin.usd;
        localStorage.setItem('btcPrice', JSON.stringify({ price: btcPrice, timestamp: Date.now() }));
        updateBtcValue(btcPrice);
    } catch (error) {
        document.getElementById('btc-value').textContent = 'Error fetching BTC price';
    }
}

function updateBtcValue(btcPrice) {
    const btcHoldings = 48237; // Update dynamically via stats
    const btcValue = (btcHoldings * btcPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    if (document.getElementById('btc-value')) {
        document.getElementById('btc-value').textContent = btcValue;
    }
}

// Fetch MARA Stock Price
async function fetchStockPrice() {
    const cached = localStorage.getItem('stockPrice');
    if (cached && Date.now() - JSON.parse(cached).timestamp < 3600000) {
        document.getElementById('stock-price').textContent = JSON.parse(cached).price;
        return;
    }
    try {
        const apiKey = 'VD5Y4LBJJWS15MBT';
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MARA&apikey=${apiKey}`);
        const data = await response.json();
        const price = `$${parseFloat(data['Global Quote']['05. price']).toFixed(2)}`;
        localStorage.setItem('stockPrice', JSON.stringify({ price, timestamp: Date.now() }));
        document.getElementById('stock-price').textContent = price;
    } catch (error) {
        document.getElementById('stock-price').textContent = 'Error fetching stock price';
    }
}

// Fetch News
async function fetchNews() {
    const newsFeed = document.getElementById('news-feed');
    if (!newsFeed) return;
    try {
        const response = await fetch('/api/fetch-news');
        const newsItems = await response.json();
        newsFeed.innerHTML = '';
        newsItems.forEach(item => {
            newsFeed.innerHTML += `
                <div class="col-md-4">
                    <div class="card bg-secondary text-light">
                        <div class="card-body">
                            <h5><a href="${item.url}" target="_blank" class="text-light">${item.title}</a></h5>
                            <p class="text-muted">Source: ${item.source} | ${item.date}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        newsFeed.innerHTML = '<p>Error fetching news</p>';
    }
}

// Fetch Stock History
async function fetchStockHistory() {
    if (!document.getElementById('stockChart')) return;
    try {
        const apiKey = 'VD5Y4LBJJWS15MBT';
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MARA&apikey=${apiKey}`);
        const data = await response.json();
        const dates = Object.keys(data['Time Series (Daily)']).slice(0, 30).reverse();
        const prices = dates.map(date => data['Time Series (Daily)'][date]['4. close']);
        new Chart(document.getElementById('stockChart'), {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'MARA Stock Price ($)',
                    data: prices,
                    borderColor: '#f7931a',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Stock Price (30 Days)', color: '#fff' }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching stock history');
    }
}

// Service Worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(error => console.error('Service Worker registration failed:', error));
}

// Initialize
fetchStats();
fetchBtcPrice();
fetchStockPrice();
fetchNews();
fetchStockHistory();