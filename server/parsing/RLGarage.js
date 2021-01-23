import cheerio from 'cheerio';
import axios from 'axios';
import querystring from 'querystring';

import RLGarageTrade from './RLGarageTrade';

const RL_GARAGE_URL = 'https://rocket-league.com/trading';

// "Enums"
const PLATFORMS = {
    PC: 1,
    Playstation: 2,
    Xbox: 3,
    Nintendo: 4
}
const SEARCH_TYPE = {
    Any: 0,
    Want: 1,
    Have: 2
}

// Fetches the RL Garage and returns the HTML of the site based on parameters
const getPage = async ({ platform=PLATFORMS.PC, search_type=SEARCH_TYPE.Any, item=0, itemPaint=0, itemCert=0, minCredits=0, maxCredits=100000 } = {}) => {
    const queryData = querystring.stringify({
        'filterItem': item,
        'filterPaint': itemPaint,
        'filterCertification': itemCert,
        'filterMinCredits': minCredits,
        'filterMaxCredits': maxCredits,
        'filterPlatform[]': platform,
        'filterSearchType': search_type
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
const scrapeTrades = (pageHTML) => {
    const $ = cheerio.load(pageHTML);
    let trades = $('.rlg-trade').map((_, e) => new RLGarageTrade($, e))

    return trades;
}

export default { getPage, scrapeTrades, PLATFORMS, SEARCH_TYPE }