import { getPage, scrapeTrades, PLATFORMS, SEARCH_TYPE } from './parsing/RLGarage.js';

getPage({platform: PLATFORMS.PC}).then((html) => {
    console.log('Page html:', html.length);
    let trades = scrapeTrades(html);
    let filteredTrades = trades.filter(trade => trade.pricedTrade)
    console.log(`Found ${filteredTrades.length} trades`)
});