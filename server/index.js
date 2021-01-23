import { getPage, scrapeTrades, inverseTrade, searchTrades, PLATFORMS, SEARCH_TYPE } from './parsing/RLGarage.js';

// Begins by getting the base trade site
getPage({platform: PLATFORMS.PC}).then((html) => {
    console.log('Page html:', html.length);

    // Passes the html to get a trade object, then filters only valid trades with priced items
    let trades = scrapeTrades(html);
    let filteredTrades = trades.filter(trade => trade.pricedTrade)
    console.log(`Found ${filteredTrades.length} trades`)

    // Cycle each trade and filter items that are priced from either side (only one side will be priced at a time)
    filteredTrades.forEach(trade => {
        let filteredItems = [...trade.hasItems.filter(item => item.price), ...trade.wantItems.filter(item => item.price)];

        // For each filtered item, make a request for an inverted trade (For example, if someone is selling an item for 500, look for someone buying for more. Or vice versa)
        filteredItems.forEach(item => {
            inverseTrade({item, buyTrade: trade.buyTrade}).then(inverse => {

                // Filter the inverted trades for only valid priced trades, then search for profitable trade combinations
                let inverseTrades = scrapeTrades(inverse).filter(trade => trade.pricedTrade);
                searchTrades(item, inverseTrades, trade.buyTrade);
            });
        });
    });
});