import cheerio from 'cheerio';
import axios from 'axios';
import querystring from 'querystring';

import RLGarageTrade from './RLGarageTrade.js';

const RL_GARAGE_URL = 'https://rocket-league.com/trading';
const BLACKLIST_TERMS = [
    ' offer', 'blueprint'
]

// "Enums"
export const PLATFORMS = {
    PC: 1,
    Playstation: 2,
    Xbox: 3,
    Nintendo: 4
}
export const SEARCH_TYPE = {
    Any: 0,
    Want: 1,
    Have: 2
}

// Fetches the RL Garage and returns the HTML of the site based on parameters
export const getPage = async ({ platform=PLATFORMS.PC, search_type=SEARCH_TYPE.Any, item=0, itemPaint=0, itemCert=0, minCredits=0, maxCredits=100000 } = {}) => {
    const queryData = querystring.stringify({
        'filterItem': item,
        'filterPaint': itemPaint,
        'filterCertification': itemCert,
        'filterMinCredits': minCredits,
        'filterMaxCredits': maxCredits,
        'filterPlatform[]': platform,
        'filterSearchType': search_type,
        'itemType': 1
    });
    const tradeUrl = `${RL_GARAGE_URL}?${queryData}`;

    try {
        var response = await axios.get(tradeUrl);
        return response.data;
    } catch (err) {
        return null;
    }
}

// Scrapes trades from the page HTML
export const scrapeTrades = (pageHTML) => {
    const $ = cheerio.load(pageHTML);
    let trades = [...$('.rlg-trade').map((_, e) => new RLGarageTrade($, e))]

    return trades;
}

// Takes in an item and generates an inverse trade
export const inverseTrade = async ({ platform=PLATFORMS.PC, item, buyTrade }) => {
    let pageData = {
        platform,
        item: item.id,
        itemPaint: item.paint,
        itemCert: item.cert,
        search_type: buyTrade ? SEARCH_TYPE.Have : SEARCH_TYPE.Want
    }

    let pageHtml = await getPage(pageData);
    return pageHtml;
}

// Takes an inverted trade object and compares to a trade item and determines profitability of a trade
export const searchTrades = (item, trades, buyTrade) => {
    trades.forEach(trade => {
        // Determines which set of items to use, then makes sure its comparing to a similar item
        let items = buyTrade ? trade.wantItems : trade.hasItems;
        let potItem = items.filter(potItem => potItem.id === item.id && potItem.paint === item.paint && potItem.cert === item.cert)[0];

        // Successful trade conditions
        if (buyTrade) {
            if (potItem.price > item.price) {
                // TODO: DO SOMETHING HERE
            }
        } else {
            if (potItem.price < item.price) {
                // TODO: DO SOMETHING HERE
            }
        }
    });
}